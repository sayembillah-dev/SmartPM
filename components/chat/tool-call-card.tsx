"use client";

import { ArrowRight, ArrowRightLeft, Check, GitBranch, Link2Off, Pencil, Plus, Target, UserMinus, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { cn } from "@/lib/utils";
import type { Priority, Status, ToolCallProposal } from "@/types";

const STATUS_LABEL: Record<Status, string> = {
  backlog: "Backlog",
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

interface Props {
  call: ToolCallProposal;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit?: () => void;
}

export function ToolCallCard({ call, onConfirm, onCancel, onEdit }: Props) {
  const { tasks, team, sprints, goals } = useSmartPM();
  const taskId = call.args.taskId as string | undefined;
  const task = taskId ? tasks.find((t) => t.id === taskId) : undefined;
  const taskLabel = task?.title ?? taskId ?? "(unknown task)";

  let icon = <ArrowRight className="w-3.5 h-3.5" />;
  let summary: React.ReactNode = "Proposed action";

  if (call.name === "update_task_status") {
    const status = call.args.status as Status | undefined;
    icon = <ArrowRight className="w-3.5 h-3.5" />;
    summary = (
      <>
        Move <strong>{taskLabel}</strong> to <strong>{status ? STATUS_LABEL[status] : "?"}</strong>
      </>
    );
  } else if (call.name === "reassign_task") {
    const memberId = call.args.memberId as string | undefined;
    const member = memberId ? team.find((m) => m.id === memberId) : undefined;
    icon = <UserPlus className="w-3.5 h-3.5" />;
    summary = (
      <>
        Reassign <strong>{taskLabel}</strong> to <strong>{member?.name ?? memberId ?? "?"}</strong>
      </>
    );
  } else if (call.name === "unassign_task") {
    icon = <UserMinus className="w-3.5 h-3.5" />;
    summary = (
      <>
        Unassign <strong>{taskLabel}</strong>
      </>
    );
  } else if (call.name === "add_task_dependency") {
    const depId = call.args.dependsOnTaskId as string | undefined;
    const dep = depId ? tasks.find((t) => t.id === depId) : undefined;
    const depLabel = dep?.title ?? depId ?? "(unknown task)";
    icon = <GitBranch className="w-3.5 h-3.5" />;
    summary = (
      <>
        Make <strong>{taskLabel}</strong> depend on <strong>{depLabel}</strong>
      </>
    );
  } else if (call.name === "remove_task_dependency") {
    const depId = call.args.dependsOnTaskId as string | undefined;
    const dep = depId ? tasks.find((t) => t.id === depId) : undefined;
    const depLabel = dep?.title ?? depId ?? "(unknown task)";
    icon = <Link2Off className="w-3.5 h-3.5" />;
    summary = (
      <>
        Remove dependency from <strong>{taskLabel}</strong> on <strong>{depLabel}</strong>
      </>
    );
  } else if (call.name === "move_task_to_sprint") {
    const targetSprintId = call.args.sprintId as string | undefined;
    const targetSprint = targetSprintId ? sprints.find((s) => s.id === targetSprintId) : undefined;
    const sourceSprint = task ? sprints.find((s) => s.id === task.sprintId) : undefined;
    icon = <ArrowRightLeft className="w-3.5 h-3.5" />;
    summary = (
      <>
        Move <strong>{taskLabel}</strong>{" "}
        {sourceSprint && (
          <>
            from <strong>{sourceSprint.name}</strong>{" "}
          </>
        )}
        to <strong>{targetSprint?.name ?? targetSprintId ?? "?"}</strong>
      </>
    );
  } else if (call.name === "set_task_goals") {
    const ids = Array.isArray(call.args.goalIds) ? (call.args.goalIds as string[]) : [];
    const labels = ids
      .map((id) => goals.find((g) => g.id === id)?.name ?? id)
      .filter(Boolean);
    icon = <Target className="w-3.5 h-3.5" />;
    summary =
      labels.length === 0 ? (
        <>
          Clear all goal links on <strong>{taskLabel}</strong>
        </>
      ) : (
        <>
          Link <strong>{taskLabel}</strong> to{" "}
          <strong>{labels.join(", ")}</strong>
        </>
      );
  } else if (call.name === "create_task") {
    const a = call.args as Record<string, unknown>;
    const newTitle = (a.title as string) ?? "(untitled)";
    const sprintId = a.sprintId as string | undefined;
    const sprint = sprintId ? sprints.find((s) => s.id === sprintId) : undefined;
    const memberId = a.assigneeId as string | undefined;
    const member = memberId ? team.find((m) => m.id === memberId) : undefined;
    const priority = a.priority as Priority | undefined;
    const points = a.storyPoints as number | undefined;
    const dueDate = a.dueDate as string | undefined;
    const estimatedHours = a.estimatedHours as number | undefined;
    icon = <Plus className="w-3.5 h-3.5" />;
    summary = (
      <div className="space-y-1">
        <div>
          Create task <strong>{newTitle}</strong>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {sprint && <span>Sprint: <span className="text-foreground">{sprint.name}</span></span>}
          {priority && <span>Priority: <span className="text-foreground">{priority}</span></span>}
          {typeof points === "number" && <span>{points} pt{points === 1 ? "" : "s"}</span>}
          {dueDate && <span>Due {dueDate}</span>}
          {typeof estimatedHours === "number" && <span>Est: <span className="text-foreground">{estimatedHours}h</span></span>}
          <span>Assignee: <span className="text-foreground">{member?.name ?? "Unassigned"}</span></span>
        </div>
      </div>
    );
  }

  const isPending = call.status === "pending";
  const canEdit = isPending && call.name === "create_task" && !!onEdit;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-sm",
        isPending && "border-brand/40 bg-brand/5",
        call.status === "confirmed" && "border-border bg-accent/40",
        call.status === "cancelled" && "border-border bg-muted/40 text-muted-foreground",
        call.status === "superseded" && "border-border bg-muted/40 text-muted-foreground",
        call.status === "failed" && "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-brand">{icon}</span>
        <div className="flex-1 min-w-0">
          <div>{summary}</div>
          {call.status !== "pending" && (
            <div className="mt-1 text-xs flex items-center gap-1">
              {call.status === "confirmed" && (
                <>
                  <Check className="w-3 h-3 text-brand" /> Applied
                </>
              )}
              {call.status === "cancelled" && (
                <>
                  <X className="w-3 h-3" /> Cancelled
                </>
              )}
              {call.status === "superseded" && (
                <>
                  <Pencil className="w-3 h-3" /> Editing — see follow-up
                </>
              )}
              {call.status === "failed" && (
                <>
                  <X className="w-3 h-3 text-destructive" /> Failed{call.result ? `: ${call.result}` : ""}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {isPending && (
        <div className="mt-3 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          {canEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
          <Button size="sm" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
}
