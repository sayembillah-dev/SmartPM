"use client";

import { AlertOctagon, Calendar, Clock, FileText, GitBranch, Sparkles, Target, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { detectBlockers, formatDate, scoreRisk, suggestAssignee } from "@/lib/agent-utils";
import { PriorityBadge } from "@/components/board/priority-badge";
import { RiskBadge } from "@/components/board/risk-badge";
import { TypeBadge } from "@/components/board/type-badge";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

interface Props {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailModal({ taskId, onClose }: Props) {
  const {
    tasks,
    team,
    blockers,
    goals,
    today,
    updateTaskAssignee,
    updateTaskTime,
    updateTaskDescription,
    updateTaskGoals,
  } = useSmartPM();
  const task = taskId ? tasks.find((t) => t.id === taskId) : null;

  const [estInput, setEstInput] = useState<string>("");
  const [trackedInput, setTrackedInput] = useState<string>("");
  const [descInput, setDescInput] = useState<string>("");

  useEffect(() => {
    if (task) {
      setEstInput(task.estimatedHours != null ? String(task.estimatedHours) : "");
      setTrackedInput(task.trackedHours != null ? String(task.trackedHours) : "");
      setDescInput(task.description ?? "");
    }
  }, [task]);

  if (!task) return null;

  function commitEstimate() {
    if (!task) return;
    const trimmed = estInput.trim();
    if (trimmed === "") {
      updateTaskTime(task.id, { estimatedHours: null });
      return;
    }
    const v = Number(trimmed);
    if (Number.isFinite(v) && v >= 0) {
      updateTaskTime(task.id, { estimatedHours: v });
    } else {
      setEstInput(task.estimatedHours != null ? String(task.estimatedHours) : "");
    }
  }

  function commitTracked() {
    if (!task) return;
    const trimmed = trackedInput.trim();
    if (trimmed === "") {
      updateTaskTime(task.id, { trackedHours: null });
      return;
    }
    const v = Number(trimmed);
    if (Number.isFinite(v) && v >= 0) {
      updateTaskTime(task.id, { trackedHours: v });
    } else {
      setTrackedInput(task.trackedHours != null ? String(task.trackedHours) : "");
    }
  }

  function logHours(delta: number) {
    if (!task) return;
    const current = task.trackedHours ?? 0;
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    updateTaskTime(task.id, { trackedHours: next });
    setTrackedInput(String(next));
  }

  function commitDescription() {
    if (!task) return;
    const trimmed = descInput.trim();
    const current = task.description ?? "";
    if (trimmed === current) return;
    updateTaskDescription(task.id, trimmed || null);
  }

  const risk = scoreRisk(task, today, tasks, team);
  const assignee = team.find((m) => m.id === task.assigneeId);
  const suggestion = !task.assigneeId ? suggestAssignee(task, team, tasks) : null;
  const suggestedMember = suggestion ? team.find((m) => m.id === suggestion.memberId) : null;
  const seededBlockers = blockers.filter((b) => b.taskId === task.id && !b.resolved);
  const detected = detectBlockers(tasks, today).filter((b) => b.taskId === task.id);
  const allBlockers = [...seededBlockers, ...detected];
  const deps = (task.dependsOn ?? [])
    .map((id) => tasks.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <Dialog open={!!taskId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">{task.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">{STATUS_LABEL[task.status]}</span>
            <PriorityBadge priority={task.priority} />
            <TypeBadge type={task.type} />
            <RiskBadge risk={risk} compact />
            <span className="text-xs text-muted-foreground">{task.storyPoints} pts</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Due
              </div>
              <div>{formatDate(task.dueDate)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <User className="w-3.5 h-3.5" />
                Assignee
              </div>
              {assignee ? (
                <div>{assignee.name} <span className="text-muted-foreground">· {assignee.role}</span></div>
              ) : (
                <div className="text-muted-foreground italic">Unassigned</div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Description
              <span className="ml-auto text-[10px] text-muted-foreground/70 normal-case">
                concise, actionable, precise — used by AI for assignment, risk, and estimation
              </span>
            </div>
            <Textarea
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              onBlur={commitDescription}
              placeholder="What needs to happen, and how. Mention key tech, files, or scope cues."
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Time
            </div>
            {(() => {
              const est = task.estimatedHours ?? 0;
              const trk = task.trackedHours ?? 0;
              const pct = est > 0 ? Math.min(100, Math.round((trk / est) * 100)) : 0;
              const overrun = est > 0 && trk > est;
              return (
                <div className="rounded-md border border-border bg-card p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground block mb-1">
                        Estimated (hours)
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step={0.5}
                        value={estInput}
                        onChange={(e) => setEstInput(e.target.value)}
                        onBlur={commitEstimate}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        }}
                        placeholder="—"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground block mb-1">
                        Tracked (hours)
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step={0.5}
                        value={trackedInput}
                        onChange={(e) => setTrackedInput(e.target.value)}
                        onBlur={commitTracked}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        }}
                        placeholder="—"
                      />
                    </label>
                  </div>

                  {est > 0 && (
                    <>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            overrun ? "bg-risk-overdue" : pct > 75 ? "bg-risk-at-risk" : "bg-brand"
                          )}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {trk}h / {est}h ({pct}%)
                        </span>
                        {overrun ? (
                          <span className="text-risk-overdue font-medium">
                            Over by {(trk - est).toFixed(1)}h
                          </span>
                        ) : pct === 100 ? (
                          <span className="text-risk-on-track font-medium">On target</span>
                        ) : (
                          <span className="text-muted-foreground">{(est - trk).toFixed(1)}h remaining</span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground mr-1">Log:</span>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => logHours(0.5)}>
                      +0.5h
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => logHours(1)}>
                      +1h
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => logHours(2)}>
                      +2h
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              AI risk assessment
            </div>
            <div className="text-sm bg-accent/40 rounded-md px-3 py-2">{risk.rationale}</div>
          </div>

          {suggestion && suggestedMember && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                Suggested assignment
              </div>
              <div className="flex items-center justify-between bg-brand/5 border border-brand/20 rounded-md px-3 py-2">
                <div className="text-sm">
                  <span className="font-medium">{suggestedMember.name}</span>
                  <span className="text-muted-foreground"> — {suggestion.rationale}</span>
                </div>
                <Button size="sm" onClick={() => updateTaskAssignee(task.id, suggestedMember.id)}>
                  Assign
                </Button>
              </div>
            </div>
          )}

          {allBlockers.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-risk-overdue" />
                Blockers detected
              </div>
              <div className="space-y-2">
                {allBlockers.map((b) => (
                  <div key={b.id} className="border border-risk-overdue/30 bg-risk-overdue/5 rounded-md px-3 py-2 text-sm">
                    <div className="font-medium text-foreground">{b.description}</div>
                    <div className="text-muted-foreground text-xs mt-1">Suggestion: {b.suggestion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deps.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                Depends on
              </div>
              <div className="space-y-1">
                {deps.map((d) => (
                  <div key={d.id} className="text-sm flex items-center justify-between border border-border rounded-md px-3 py-1.5">
                    <span>{d.title}</span>
                    <span className="text-xs text-muted-foreground">{STATUS_LABEL[d.status]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {goals.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Goals & milestones
              </div>
              <div className="space-y-1">
                {goals.map((g) => {
                  const linked = (task.goalIds ?? []).includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 text-sm border border-border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent/40"
                    >
                      <input
                        type="checkbox"
                        className="accent-brand"
                        checked={linked}
                        onChange={() => {
                          const current = task.goalIds ?? [];
                          const next = linked
                            ? current.filter((id) => id !== g.id)
                            : [...current, g.id];
                          updateTaskGoals(task.id, next);
                        }}
                      />
                      <span className="flex-1">{g.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{g.kind}</span>
                      <span className="text-xs text-muted-foreground">{g.targetDate}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
