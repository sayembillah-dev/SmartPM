"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertOctagon, Clock, GitBranch, Sparkles } from "lucide-react";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { scoreRisk, suggestAssignee, formatDate } from "@/lib/agent-utils";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/board/priority-badge";
import { RiskBadge } from "@/components/board/risk-badge";
import { TypeBadge } from "@/components/board/type-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Task } from "@/types";

interface Props {
  task: Task;
  onClick: () => void;
  hasBlocker: boolean;
}

export function TaskCard({ task, onClick, hasBlocker }: Props) {
  const { today, tasks, team, updateTaskAssignee } = useSmartPM();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const risk = scoreRisk(task, today, tasks, team);
  const assignee = team.find((m) => m.id === task.assigneeId);
  const suggestion = !task.assigneeId ? suggestAssignee(task, team, tasks) : null;
  const suggestedMember = suggestion ? team.find((m) => m.id === suggestion.memberId) : null;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Suppress click if a drag just happened
        if (isDragging) return;
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "group bg-card border border-border rounded-md p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md hover:border-brand/40 transition-all",
        hasBlocker && "border-risk-overdue/40"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">{task.title}</p>
        {hasBlocker && (
          <Tooltip>
            <TooltipTrigger render={<AlertOctagon className="w-4 h-4 text-risk-overdue shrink-0" />} />
            <TooltipContent>Blocker detected</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <PriorityBadge priority={task.priority} />
        <TypeBadge type={task.type} />
        <RiskBadge risk={risk} compact />
        {task.dependsOn && task.dependsOn.length > 0 && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground" />
              }
            >
              <GitBranch className="w-3 h-3" />
              {task.dependsOn.length}
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Depends on:
              <ul className="mt-1 list-disc list-inside text-xs">
                {task.dependsOn.map((id) => {
                  const dep = tasks.find((t) => t.id === id);
                  return <li key={id}>{dep?.title ?? id}</li>;
                })}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
        {typeof task.estimatedHours === "number" && task.estimatedHours > 0 && (() => {
          const tracked = task.trackedHours ?? 0;
          const overrun = tracked > task.estimatedHours;
          return (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                      overrun
                        ? "border-risk-overdue/30 bg-risk-overdue/10 text-risk-overdue"
                        : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  />
                }
              >
                <Clock className="w-3 h-3" />
                {tracked}h / {task.estimatedHours}h
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {overrun
                  ? `Tracked ${tracked}h vs ${task.estimatedHours}h estimated — over by ${(tracked - task.estimatedHours).toFixed(1)}h`
                  : `Tracked ${tracked}h of ${task.estimatedHours}h estimated`}
              </TooltipContent>
            </Tooltip>
          );
        })()}
        <span className="text-xs text-muted-foreground ml-auto">{task.storyPoints} pts</span>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Due {formatDate(task.dueDate)}</span>
        {assignee ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-[10px] font-semibold flex items-center justify-center" />
              }
            >
              {assignee.avatarInitial}
            </TooltipTrigger>
            <TooltipContent>{assignee.name}</TooltipContent>
          </Tooltip>
        ) : suggestedMember ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskAssignee(task.id, suggestedMember.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-brand bg-brand/10 hover:bg-brand/20 px-1.5 py-0.5 rounded transition-colors"
                />
              }
            >
              <Sparkles className="w-3 h-3" />
              Suggest: {suggestedMember.avatarInitial}
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{suggestion?.rationale}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-muted-foreground italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}
