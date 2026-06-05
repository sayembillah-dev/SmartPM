"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { toast } from "sonner";
import type { Employee } from "@/types";

interface Props {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
}

interface DraftState {
  name: string;
  role: string;
  description: string;
  weeklyCapacityPoints: number;
}

const EMPTY: DraftState = {
  name: "",
  role: "",
  description: "",
  weeklyCapacityPoints: 13,
};

export function EmployeeDialog({ open, employee, onClose }: Props) {
  const { addEmployee, updateEmployee } = useSmartPM();
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!employee;

  useEffect(() => {
    if (open) {
      setDraft(
        employee
          ? {
              name: employee.name,
              role: employee.role,
              description: employee.description ?? "",
              weeklyCapacityPoints: employee.weeklyCapacityPoints,
            }
          : EMPTY
      );
    }
  }, [open, employee]);

  function save() {
    setSubmitting(true);
    const payload = {
      name: draft.name,
      role: draft.role,
      description: draft.description,
      weeklyCapacityPoints: draft.weeklyCapacityPoints,
    };
    const result = isEdit ? updateEmployee(employee!.id, payload) : addEmployee(payload);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save employee.");
      return;
    }
    toast.success(isEdit ? "Employee updated" : "Employee added");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            Capture what each person is good at — the AI uses this when recommending assignments across all projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <Field label="Name">
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Jordan Patel"
              autoFocus
            />
          </Field>

          <Field label="Role">
            <Input
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
              placeholder="e.g. Frontend Engineer"
            />
          </Field>

          <Field
            label="What they're good at"
            hint="Short bio of strengths, areas of expertise, past wins. The AI reads this verbatim."
          >
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. Strong with API design and Postgres. Owned the auth rewrite last quarter."
              rows={4}
              className="resize-none"
            />
          </Field>

          <Field label="Weekly capacity (story points)">
            <Input
              type="number"
              min={0}
              value={draft.weeklyCapacityPoints}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  weeklyCapacityPoints: Math.max(0, Number(e.target.value) || 0),
                }))
              }
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={save} disabled={submitting || !draft.name.trim() || !draft.role.trim()}>
            {isEdit ? "Save changes" : "Add employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground block mb-1">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
