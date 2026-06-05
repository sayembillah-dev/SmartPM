"use client";

import { Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { computeTeamLoad } from "@/lib/agent-utils";
import { cn } from "@/lib/utils";
import { AddTeamMemberDialog } from "@/components/team/add-team-member-dialog";
import { toast } from "sonner";
import type { TeamMember } from "@/types";

export function TeamPage() {
  const { team, tasks, sprints, selectedSprintId, selectedProject, removeMemberFromActiveProject } =
    useSmartPM();
  const [addOpen, setAddOpen] = useState(false);

  const activeSprint = sprints.find((s) => s.id === selectedSprintId);
  const sprintTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === selectedSprintId),
    [tasks, selectedSprintId]
  );
  const loads = useMemo(() => computeTeamLoad(sprintTasks, team), [sprintTasks, team]);

  function confirmRemove(m: TeamMember) {
    toast(`Remove ${m.name} from ${selectedProject.name}?`, {
      description: "Their open tasks in this project will be unassigned. Their employee record stays in Resources.",
      action: {
        label: "Remove",
        onClick: () => {
          const res = removeMemberFromActiveProject(m.id);
          if (!res.ok) {
            toast.error(res.error ?? "Could not remove.");
            return;
          }
          toast.success(
            res.unassignedTaskCount
              ? `Removed — ${res.unassignedTaskCount} task${res.unassignedTaskCount === 1 ? "" : "s"} unassigned.`
              : `Removed ${m.name}.`
          );
        },
      },
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            People assigned to <span className="text-foreground font-medium">{selectedProject.name}</span>. Add or remove people here — to edit a person's details (name, role, description, capacity), head to{" "}
            <Link href="/resources" className="text-brand underline-offset-2 hover:underline">
              Resources
            </Link>
            .
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add member
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => {
          const load = loads.find((l) => l.memberId === m.id);
          const pts = load?.storyPoints ?? 0;
          const pct = m.weeklyCapacityPoints > 0
            ? Math.min(100, Math.round((pts / m.weeklyCapacityPoints) * 100))
            : 0;
          const over = pts > m.weeklyCapacityPoints;
          return (
            <div
              key={m.id}
              className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3"
            >
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
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => confirmRemove(m)}
                  aria-label="Remove from project"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              {m.description ? (
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">{m.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description yet. Edit this person in{" "}
                  <Link href="/resources" className="text-brand underline-offset-2 hover:underline">
                    Resources
                  </Link>
                  .
                </p>
              )}

              <div className="mt-auto">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span
                    className="text-[11px] uppercase tracking-wide text-muted-foreground truncate"
                    title={activeSprint?.name ?? "No sprint selected"}
                  >
                    Sprint load{activeSprint ? ` · ${activeSprint.name.split(" — ")[0]}` : ""}
                  </span>
                  <span className={cn("text-xs font-medium", over ? "text-risk-overdue" : "text-muted-foreground")}>
                    {pts} / {m.weeklyCapacityPoints} pts
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      over ? "bg-risk-overdue" : pct > 75 ? "bg-risk-at-risk" : "bg-brand"
                    )}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setAddOpen(true)}
          className="rounded-lg border-2 border-dashed border-border hover:border-brand/50 hover:bg-accent/30 transition-colors p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-brand min-h-[200px]"
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-sm font-medium">Add member</span>
        </button>
      </div>

      <AddTeamMemberDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
