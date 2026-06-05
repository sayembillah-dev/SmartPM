"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { toast } from "sonner";
import type { Priority, Status } from "@/types";

interface Props {
  open: boolean;
  initialStatus?: Status;
  onClose: () => void;
}

interface DraftState {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  storyPoints: 1 | 2 | 3 | 5 | 8;
  dueDate: string;
  sprintId: string;
  assigneeId: string; // "" for unassigned
  estimatedHours: string;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const POINT_OPTIONS: (1 | 2 | 3 | 5 | 8)[] = [1, 2, 3, 5, 8];

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function CreateTaskDialog({ open, initialStatus, onClose }: Props) {
  const { sprints, team, selectedSprintId, today, addTask } = useSmartPM();
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<DraftState>(() => makeDefault());

  function makeDefault(): DraftState {
    const sprintId = selectedSprintId || sprints[0]?.id || "";
    const sprint = sprints.find((s) => s.id === sprintId);
    const due = sprint
      ? sprint.endDate < today
        ? addDaysIso(today, 5)
        : addDaysIso(today, 3) > sprint.endDate
          ? sprint.endDate
          : addDaysIso(today, 3)
      : addDaysIso(today, 5);
    return {
      title: "",
      description: "",
      status: initialStatus ?? "todo",
      priority: "medium",
      storyPoints: 3,
      dueDate: due,
      sprintId,
      assigneeId: "",
      estimatedHours: "",
    };
  }

  useEffect(() => {
    if (open) {
      setDraft(makeDefault());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialStatus, selectedSprintId]);

  function save() {
    setSubmitting(true);
    const estimatedNum = draft.estimatedHours.trim()
      ? Number(draft.estimatedHours)
      : undefined;
    if (estimatedNum !== undefined && (!Number.isFinite(estimatedNum) || estimatedNum < 0)) {
      setSubmitting(false);
      toast.error("Estimated hours must be a non-negative number.");
      return;
    }
    const result = addTask({
      title: draft.title,
      description: draft.description.trim() || undefined,
      status: draft.status,
      assigneeId: draft.assigneeId || null,
      priority: draft.priority,
      storyPoints: draft.storyPoints,
      dueDate: draft.dueDate,
      sprintId: draft.sprintId,
      estimatedHours: estimatedNum,
    });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not create task.");
      return;
    }
    toast.success("Task created");
    onClose();
  }

  const valid =
    draft.title.trim().length > 0 &&
    draft.sprintId !== "" &&
    /^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add a new task to the active project. Required fields are marked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <Field label="Title" required>
            <Input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Add password strength meter to signup"
              autoFocus
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Optional context, scope, or acceptance criteria…"
              rows={3}
              className="resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Sprint" required>
              <Select
                value={draft.sprintId}
                onValueChange={(v) => v && setDraft((d) => ({ ...d, sprintId: v }))}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status">
              <Select
                value={draft.status}
                onValueChange={(v) => v && setDraft((d) => ({ ...d, status: v as Status }))}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Priority">
              <Select
                value={draft.priority}
                onValueChange={(v) => v && setDraft((d) => ({ ...d, priority: v as Priority }))}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Story points">
              <Select
                value={String(draft.storyPoints)}
                onValueChange={(v) =>
                  v && setDraft((d) => ({ ...d, storyPoints: Number(v) as 1 | 2 | 3 | 5 | 8 }))
                }
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POINT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Due date" required>
              <Input
                type="date"
                value={draft.dueDate}
                onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Assignee">
              <Select
                value={draft.assigneeId || "__unassigned"}
                onValueChange={(v) => {
                  if (!v) return;
                  setDraft((d) => ({ ...d, assigneeId: v === "__unassigned" ? "" : v }));
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unassigned">Unassigned</SelectItem>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Estimated hours">
              <Input
                type="number"
                min={0}
                step={0.5}
                value={draft.estimatedHours}
                onChange={(e) => setDraft((d) => ({ ...d, estimatedHours: e.target.value }))}
                placeholder="optional"
              />
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={save} disabled={submitting || !valid}>
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground block mb-1">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
