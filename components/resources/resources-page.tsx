"use client";

import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { EmployeeDialog } from "@/components/resources/employee-dialog";
import { toast } from "sonner";
import type { Employee } from "@/types";

type Section = "employees";

export function ResourcesPage() {
  const { employees, memberships, projects, removeEmployee } = useSmartPM();
  const [section] = useState<Section>("employees");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const projectsByEmployee = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const m of memberships) {
      const arr = map.get(m.employeeId) ?? [];
      if (!arr.includes(m.projectId)) arr.push(m.projectId);
      map.set(m.employeeId, arr);
    }
    return map;
  }, [memberships]);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(e: Employee) {
    setEditing(e);
    setDialogOpen(true);
  }

  function confirmRemove(e: Employee) {
    toast(`Remove ${e.name} from all projects?`, {
      description: "They'll be removed from every project team and their open tasks unassigned.",
      action: {
        label: "Remove",
        onClick: () => {
          const res = removeEmployee(e.id);
          if (!res.ok) {
            toast.error(res.error ?? "Could not remove.");
            return;
          }
          const parts: string[] = [];
          if (res.removedFromProjects) parts.push(`removed from ${res.removedFromProjects} project${res.removedFromProjects === 1 ? "" : "s"}`);
          if (res.unassignedTaskCount) parts.push(`${res.unassignedTaskCount} task${res.unassignedTaskCount === 1 ? "" : "s"} unassigned`);
          toast.success(parts.length ? `Removed ${e.name} — ${parts.join(", ")}.` : `Removed ${e.name}.`);
        },
      },
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage employees globally. Edits here propagate to every project this person is on. To put someone on a project,
            head to the Team page for that project and add them from this pool.
          </p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add employee
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4 border-b border-border">
        <button
          type="button"
          className={
            "px-3 py-2 text-sm font-medium border-b-2 -mb-px " +
            (section === "employees"
              ? "border-brand text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground")
          }
        >
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Employees
            <span className="text-xs text-muted-foreground rounded-full bg-muted px-1.5 py-0.5">
              {employees.length}
            </span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((m) => {
          const projectIds = projectsByEmployee.get(m.id) ?? [];
          return (
            <div key={m.id} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-brand/10 text-brand font-semibold">
                    {m.avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-foreground truncate">{m.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => openEdit(m)} aria-label="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => confirmRemove(m)}
                    aria-label="Remove"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {m.description ? (
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">{m.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description yet. Add one so the AI can match this person to the right work.
                </p>
              )}

              <div className="mt-auto pt-2 border-t border-border">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Capacity
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {m.weeklyCapacityPoints} pts/week
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    On
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {projectIds.length === 0
                      ? "No projects"
                      : projectIds
                          .map((pid) => projects.find((p) => p.id === pid)?.name ?? pid)
                          .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={openAdd}
          className="rounded-lg border-2 border-dashed border-border hover:border-brand/50 hover:bg-accent/30 transition-colors p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-brand min-h-[220px]"
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-sm font-medium">Add employee</span>
        </button>
      </div>

      <EmployeeDialog open={dialogOpen} employee={editing} onClose={() => setDialogOpen(false)} />
    </>
  );
}
