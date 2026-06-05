"use client";

import { AlertTriangle, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/board/priority-badge";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/agent-utils";
import type { RiskLevel, SummaryReport as SummaryReportType, VerdictLevel } from "@/types";

const VERDICT_STYLES: Record<VerdictLevel, { wrapper: string; chip: string; label: string; Icon: typeof CheckCircle2 }> = {
  healthy: {
    wrapper: "bg-risk-on-track/5 border-risk-on-track/30",
    chip: "bg-risk-on-track/15 text-risk-on-track border-risk-on-track/30",
    label: "Healthy",
    Icon: CheckCircle2,
  },
  watch: {
    wrapper: "bg-risk-at-risk/5 border-risk-at-risk/30",
    chip: "bg-risk-at-risk/15 text-risk-at-risk border-risk-at-risk/30",
    label: "Watch",
    Icon: Clock,
  },
  concerning: {
    wrapper: "bg-risk-overdue/5 border-risk-overdue/30",
    chip: "bg-risk-overdue/15 text-risk-overdue border-risk-overdue/30",
    label: "Concerning",
    Icon: AlertTriangle,
  },
};

const RISK_STYLES: Record<RiskLevel, string> = {
  on_track: "bg-risk-on-track/10 text-risk-on-track border-risk-on-track/30",
  at_risk: "bg-risk-at-risk/10 text-risk-at-risk border-risk-at-risk/30",
  overdue: "bg-risk-overdue/10 text-risk-overdue border-risk-overdue/30",
};

const RISK_LABEL: Record<RiskLevel, string> = {
  on_track: "On track",
  at_risk: "At risk",
  overdue: "Overdue",
};

function RiskChip({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        RISK_STYLES[risk]
      )}
    >
      {RISK_LABEL[risk]}
    </span>
  );
}

function AssigneeChip({ memberId }: { memberId: string | null }) {
  const { team } = useSmartPM();
  const member = memberId ? team.find((m) => m.id === memberId) : undefined;
  if (!member) {
    return <span className="text-xs text-muted-foreground italic">Unassigned</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Avatar size="sm" className="size-5">
        <AvatarFallback className="text-[10px] bg-brand/10 text-brand">
          {member.avatarInitial}
        </AvatarFallback>
      </Avatar>
      {member.name}
    </span>
  );
}

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground rounded-full bg-muted px-1.5 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
}

export function SummaryReport({ report }: { report: SummaryReportType }) {
  const { tasks, blockers } = useSmartPM();
  const findTask = (id: string) => tasks.find((t) => t.id === id);
  const findBlocker = (id: string) => blockers.find((b) => b.id === id);

  const verdict = VERDICT_STYLES[report.verdict.level];
  const VerdictIcon = verdict.Icon;

  const pct = report.kpis.pointsPlanned > 0
    ? Math.min(100, Math.round((report.kpis.pointsDone / report.kpis.pointsPlanned) * 100))
    : 0;

  return (
    <div className="space-y-4">
      <div className={cn("rounded-lg border p-4 flex gap-3", verdict.wrapper)}>
        <div className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold shrink-0 h-fit", verdict.chip)}>
          <VerdictIcon className="w-3.5 h-3.5" />
          {verdict.label}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{report.verdict.headline}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard label="Points" value={`${report.kpis.pointsDone}/${report.kpis.pointsPlanned}`} sublabel={`${pct}% complete`} />
        <KpiCard label="Done" value={String(report.kpis.completedTasks)} sublabel="tasks" />
        <KpiCard
          label="Blockers"
          value={String(report.kpis.blockersCount)}
          sublabel="unresolved"
          tone={report.kpis.blockersCount > 0 ? "warn" : "default"}
        />
        <KpiCard
          label="At Risk"
          value={String(report.kpis.riskCount)}
          sublabel="tasks"
          tone={report.kpis.riskCount > 0 ? "danger" : "default"}
        />
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>

      {report.recommendations.length > 0 && (
        <section className="rounded-lg border border-brand/30 bg-brand/5 p-4">
          <SectionHeader icon={<Sparkles className="w-4 h-4 text-brand" />} title="Recommended actions" />
          <ol className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 size-5 rounded-full bg-brand text-white text-[11px] font-semibold inline-flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{r.action}</div>
                  {r.reason && <div className="text-xs text-muted-foreground mt-0.5">{r.reason}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {report.blockers.length > 0 && (
        <section>
          <SectionHeader
            icon={<AlertTriangle className="w-4 h-4 text-risk-overdue" />}
            title="Blockers"
            count={report.blockers.length}
          />
          <div className="space-y-2">
            {report.blockers.map((b) => {
              const blocker = findBlocker(b.blockerId);
              const task = blocker ? findTask(blocker.taskId) : undefined;
              return (
                <div key={b.blockerId} className="rounded-md border border-risk-overdue/20 bg-risk-overdue/5 p-3">
                  <div className="text-sm font-medium text-foreground">
                    {task?.title ?? blocker?.description ?? b.blockerId}
                  </div>
                  {blocker && (
                    <div className="text-xs text-muted-foreground mt-1">{blocker.description}</div>
                  )}
                  <div className="text-xs mt-2 flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand mt-0.5 shrink-0" />
                    <span className="text-foreground">{b.suggestedAction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {report.risks.length > 0 && (
        <section>
          <SectionHeader
            icon={<TrendingUp className="w-4 h-4 text-risk-at-risk" />}
            title="Top risks"
            count={report.risks.length}
          />
          <div className="space-y-1.5">
            {report.risks.map((r) => {
              const task = findTask(r.taskId);
              if (!task) return null;
              return (
                <div key={r.taskId} className="rounded-md border border-border p-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{task.title}</span>
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-muted-foreground ml-auto">Due {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <AssigneeChip memberId={task.assigneeId} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5">{r.rationale}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {report.inProgress.length > 0 && (
        <section>
          <SectionHeader
            icon={<Clock className="w-4 h-4 text-brand" />}
            title="In progress"
            count={report.inProgress.length}
          />
          <div className="space-y-1">
            {report.inProgress.map((item) => {
              const task = findTask(item.taskId);
              if (!task) return null;
              return (
                <div key={item.taskId} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/40">
                  <RiskChip risk={item.risk} />
                  <span className="text-sm text-foreground truncate flex-1">{task.title}</span>
                  <AssigneeChip memberId={task.assigneeId} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {report.completed.length > 0 && (
        <section>
          <SectionHeader
            icon={<CheckCircle2 className="w-4 h-4 text-risk-on-track" />}
            title="Completed"
            count={report.completed.length}
          />
          <div className="space-y-1">
            {report.completed.map((item) => {
              const task = findTask(item.taskId);
              if (!task) return null;
              return (
                <div key={item.taskId} className="flex items-center gap-2 py-1.5 px-2 rounded-md text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-risk-on-track shrink-0" />
                  <span className="text-sm line-through truncate flex-1">{task.title}</span>
                  <span className="text-xs">{task.storyPoints} pt</span>
                  <AssigneeChip memberId={task.assigneeId} />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sublabel,
  tone = "default",
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "warn" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "default" && "border-border bg-card",
        tone === "warn" && "border-risk-at-risk/30 bg-risk-at-risk/5",
        tone === "danger" && "border-risk-overdue/30 bg-risk-overdue/5"
      )}
    >
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-xl font-semibold mt-0.5",
          tone === "warn" && "text-risk-at-risk",
          tone === "danger" && "text-risk-overdue"
        )}
      >
        {value}
      </div>
      {sublabel && <div className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</div>}
    </div>
  );
}

