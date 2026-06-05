"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import {
  accuracyByMember,
  avgCycleTimeDays,
  blockersOverTime,
  burndown,
  completionRate,
  computeTeamLoad,
  cycleTimeByType,
  estimationAccuracy,
  formatDate,
  goalAlignment,
  milestoneForecast,
  riskDistribution,
  scopeCreepEvents,
  sprintVelocity,
  tasksStaleInStatus,
} from "@/lib/agent-utils";
import { KpiCard } from "@/components/analytics/kpi-card";
import { ChartCard } from "@/components/analytics/chart-card";

const RISK_COLORS = {
  on_track: "#16a34a",
  at_risk: "#d97706",
  overdue: "#dc2626",
} as const;

export function AnalyticsDashboard() {
  const { tasks, team, sprints, blockers, goals, selectedSprintId, today, openChatWithQuery } = useSmartPM();
  const selectedSprint = sprints.find((s) => s.id === selectedSprintId);

  const staleCount = useMemo(() => tasksStaleInStatus(tasks, today, 3).length, [tasks, today]);
  const scopeCreepCount = useMemo(
    () => (selectedSprint ? scopeCreepEvents(selectedSprint, tasks).length : 0),
    [selectedSprint, tasks]
  );
  const cycleTimeTypes = useMemo(() => cycleTimeByType(tasks), [tasks]);
  const primaryGoal = useMemo(
    () =>
      goals.find((g) => g.kind === "milestone") ??
      goals.find((g) => g.quarter === "Q2") ??
      goals[0] ??
      null,
    [goals]
  );
  const primaryAlignment = useMemo(
    () => (primaryGoal ? goalAlignment(tasks, primaryGoal.id) : null),
    [tasks, primaryGoal]
  );
  const goalRows = useMemo(
    () =>
      goals.map((g) => ({
        goal: g,
        alignment: goalAlignment(tasks, g.id),
        forecast: milestoneForecast(sprints, tasks, g, today, 3),
      })),
    [goals, tasks, sprints, today]
  );

  const velocityData = useMemo(
    () => sprints.map((s) => ({ name: s.name.split(" — ")[0], points: sprintVelocity(tasks, s), status: s.status })),
    [sprints, tasks]
  );

  const completion = useMemo(() => completionRate(tasks, selectedSprintId), [tasks, selectedSprintId]);
  const completionData = [
    { name: "Done", value: completion.done, fill: "#16a34a" },
    { name: "Remaining", value: completion.total - completion.done, fill: "#e5e7eb" },
  ];

  const blockersData = useMemo(() => blockersOverTime(blockers), [blockers]);

  const workloadData = useMemo(() => {
    const loads = computeTeamLoad(tasks, team);
    return team.map((m) => {
      const l = loads.find((x) => x.memberId === m.id);
      return {
        name: m.name.split(" ")[0],
        tasks: l?.taskCount ?? 0,
        points: l?.storyPoints ?? 0,
        capacity: m.weeklyCapacityPoints,
      };
    });
  }, [tasks, team]);

  const cycleTime = useMemo(() => avgCycleTimeDays(tasks), [tasks]);

  const risk = useMemo(() => {
    const sprintTasks = tasks.filter((t) => t.sprintId === selectedSprintId);
    return riskDistribution(sprintTasks, today, team);
  }, [tasks, selectedSprintId, today, team]);

  const riskData = [
    { name: "On Track", value: risk.on_track, fill: RISK_COLORS.on_track },
    { name: "At Risk", value: risk.at_risk, fill: RISK_COLORS.at_risk },
    { name: "Overdue", value: risk.overdue, fill: RISK_COLORS.overdue },
  ];

  const burndownData = useMemo(() => {
    if (!selectedSprint) return [];
    return burndown(selectedSprint, tasks, today).map((p) => ({
      ...p,
      date: formatDate(p.date),
      actual: Number.isNaN(p.actual) ? null : p.actual,
    }));
  }, [selectedSprint, tasks, today]);

  const totalSprintPoints = useMemo(
    () => tasks.filter((t) => t.sprintId === selectedSprintId).reduce((s, t) => s + t.storyPoints, 0),
    [tasks, selectedSprintId]
  );

  const accuracy = useMemo(() => estimationAccuracy(tasks), [tasks]);
  const memberAccuracy = useMemo(() => accuracyByMember(tasks, team), [tasks, team]);

  const accuracyChartData = useMemo(
    () =>
      memberAccuracy
        .map((m) => {
          const member = team.find((tm) => tm.id === m.memberId);
          const overPct = Math.round((m.varianceRatio - 1) * 100);
          return {
            name: member?.name.split(" ")[0] ?? m.memberId,
            overPct,
            count: m.count,
            fill: overPct > 15 ? "#dc2626" : overPct < -10 ? "#16a34a" : "#2563eb",
          };
        })
        .sort((a, b) => b.overPct - a.overPct),
    [memberAccuracy, team]
  );

  const accuracyPct = accuracy.count > 0 ? Math.round((1 - Math.min(1, accuracy.meanAbsErrorPct / 100)) * 100) : 0;
  const variancePctSigned = accuracy.count > 0 ? Math.round((accuracy.varianceRatio - 1) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Completion Rate"
          value={completion.pct}
          suffix="%"
          hint={`${completion.done} of ${completion.total} tasks done`}
          info="Percentage of tasks in the selected sprint marked 'done'. Tracks how much of the committed sprint scope the team has delivered."
          onAskAI={() => openChatWithQuery(`Our completion rate is ${completion.pct}% (${completion.done} of ${completion.total} tasks done). Is that on track for where we are in the sprint, and what's holding it back?`)}
        />
        <KpiCard
          title="Avg Cycle Time"
          value={cycleTime}
          suffix="days"
          hint="Across all completed tasks"
          info="Average number of days from when a task moved to 'in progress' until it was marked 'done', across all completed tasks. Lower values indicate faster, more consistent delivery."
          onAskAI={() => openChatWithQuery(`Our average cycle time is ${cycleTime} days across all completed tasks. Is that healthy for a team our size, and what's driving it?`)}
        />
        <KpiCard
          title="Sprint Points"
          value={totalSprintPoints}
          suffix="pts"
          hint={selectedSprint?.name ?? "—"}
          info="Total story points committed to the selected sprint. Reflects the scope the team agreed to deliver — compare with velocity to spot over- or under-commitment."
          onAskAI={() => openChatWithQuery(`We committed ${totalSprintPoints} points this sprint. How does that compare to our velocity history, and is it realistic?`)}
        />
        <KpiCard
          title="Open Blockers"
          value={blockers.filter((b) => !b.resolved).length}
          suffix=""
          hint="Across all sprints"
          info="Number of blocker issues that have not yet been resolved. Unresolved blockers directly delay task completion and increase delivery risk."
          onAskAI={() => openChatWithQuery(`We have ${blockers.filter((b) => !b.resolved).length} open blockers. Which ones are most critical and what should we do about them?`)}
        />
      </div>

      {/* PM persona row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Stale Tasks"
          value={staleCount}
          suffix=""
          hint="In the same status > 3 days"
          info="Tasks that have not changed status in more than 3 days. A high count signals unclear ownership, hidden dependencies, or work that is blocked but not formally flagged."
          onAskAI={() => openChatWithQuery(`We have ${staleCount} stale tasks stuck in the same status for more than 3 days. Which ones should I be most worried about, and what's causing them to stall?`)}
        />
        <KpiCard
          title="Scope Creep"
          value={scopeCreepCount}
          suffix=""
          hint="Added after sprint start"
          info="Tasks added to the sprint after it officially started. Frequent additions erode capacity predictability, inflate sprint scope, and increase the risk of not meeting the sprint goal."
          onAskAI={() => openChatWithQuery(`We have ${scopeCreepCount} scope creep events this sprint — tasks added after it started. What impact does this have on our sprint goal and what should we do?`)}
        />
        <KpiCard
          title={primaryGoal ? "Goal Alignment" : "Goal Alignment"}
          value={primaryAlignment?.pct ?? 0}
          suffix="%"
          hint={
            primaryGoal && primaryAlignment
              ? `${primaryAlignment.aligned}/${primaryAlignment.total} backlog linked to ${primaryGoal.name}`
              : "No goals defined for this project"
          }
          info="Percentage of backlog items linked to the primary project goal. High alignment means the team is focused on work that moves the needle; low alignment suggests scattered or misaligned effort."
          onAskAI={() => openChatWithQuery(`Our goal alignment is ${primaryAlignment?.pct ?? 0}% — ${primaryAlignment?.aligned ?? 0} of ${primaryAlignment?.total ?? 0} backlog items are linked to our primary goal. Is that healthy, and which tasks are misaligned?`)}
        />
        <KpiCard
          title="Bug vs Feature"
          value={Math.abs(cycleTimeTypes.bugVsFeatureDelta)}
          suffix="d"
          hint={
            cycleTimeTypes.counts.bug + cycleTimeTypes.counts.feature === 0
              ? "Not enough completed tasks"
              : `Bugs ${cycleTimeTypes.bug}d · Features ${cycleTimeTypes.feature}d`
          }
          info="Difference in average cycle time between bug fixes and feature tasks (in days). A large gap where bugs take longer may indicate poor bug triage, hidden complexity, or mounting technical debt."
          onAskAI={() => openChatWithQuery(`Our bug cycle time is ${cycleTimeTypes.bug}d vs features at ${cycleTimeTypes.feature}d — a ${Math.abs(cycleTimeTypes.bugVsFeatureDelta)}d delta. What does this tell us and what should we do?`)}
        />
      </div>

      {/* Goals panel */}
      {goalRows.length > 0 && (
        <div className="rounded-md border border-border bg-card p-4">
          <div className="text-sm font-medium mb-3">Goals & milestones</div>
          <div className="space-y-2">
            {goalRows.map(({ goal, alignment, forecast }) => {
              const badgeClass = forecast.willHit
                ? "bg-risk-on-track/15 text-risk-on-track border-risk-on-track/30"
                : forecast.confidence === "low"
                  ? "bg-risk-at-risk/15 text-risk-at-risk border-risk-at-risk/30"
                  : "bg-risk-overdue/15 text-risk-overdue border-risk-overdue/30";
              const badgeLabel = forecast.willHit
                ? "On track"
                : forecast.confidence === "low"
                  ? "Uncertain"
                  : "Off track";
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{goal.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {goal.kind} · target {goal.targetDate} · {alignment.pct}% of backlog ({alignment.aligned}/{alignment.total})
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right hidden sm:block">
                    {forecast.pointsRemaining} pts left
                    {forecast.expectedPointsPerSprint > 0 && (
                      <> · {forecast.expectedPointsPerSprint}/sprint</>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium ${badgeClass}`}
                  >
                    {badgeLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time tracking row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Estimation Accuracy"
          value={accuracy.count > 0 ? accuracyPct : 0}
          suffix="%"
          hint={
            accuracy.count > 0
              ? `Avg ${accuracy.meanAbsErrorPct}% off on ${accuracy.count} completed`
              : "No completed tasks yet"
          }
          info="How close estimated hours are to actual tracked hours, expressed as a 0–100% score. 100% means perfect estimates; lower scores indicate the team is consistently over- or under-estimating their work."
          onAskAI={() => openChatWithQuery(`Our estimation accuracy is ${accuracyPct}% — we're averaging ${accuracy.meanAbsErrorPct}% off on ${accuracy.count} completed tasks. What's causing the gap and how do we improve?`)}
        />
        <KpiCard
          title="Estimate vs Actual"
          value={accuracy.count > 0 ? Math.abs(variancePctSigned) : 0}
          suffix={accuracy.count > 0 ? (variancePctSigned >= 0 ? "% over" : "% under") : "%"}
          hint={
            accuracy.count > 0
              ? `${accuracy.trackedTotal}h tracked / ${accuracy.estimatedTotal}h estimated`
              : "—"
          }
          info="Average percentage by which actual tracked time exceeded ('over') or fell short of ('under') the original estimate. Helps identify systematic bias in planning — e.g. the team consistently underestimates complex tasks."
          onAskAI={() => openChatWithQuery(`We're ${Math.abs(variancePctSigned)}% ${variancePctSigned >= 0 ? "over" : "under"} on estimates (${accuracy.trackedTotal}h tracked vs ${accuracy.estimatedTotal}h estimated). Which team members are most off and why?`)}
        />
        <KpiCard
          title="Hours Logged"
          value={Math.round(tasks.reduce((s, t) => s + (t.trackedHours ?? 0), 0))}
          suffix="h"
          hint="Across all tasks in project"
          info="Total hours tracked across all tasks in the project, regardless of status or sprint. Reflects cumulative team effort and can be compared against estimated totals to gauge planning accuracy at scale."
          onAskAI={() => openChatWithQuery(`We've logged ${Math.round(tasks.reduce((s, t) => s + (t.trackedHours ?? 0), 0))}h across all project tasks. How does that compare to our estimates, and what does it tell us about our planning accuracy?`)}
        />
        <KpiCard
          title="Hours Remaining"
          value={Math.max(
            0,
            Math.round(
              tasks
                .filter((t) => t.status !== "done")
                .reduce((s, t) => s + Math.max((t.estimatedHours ?? 0) - (t.trackedHours ?? 0), 0), 0)
            )
          )}
          suffix="h"
          hint="Estimated work left on open tasks"
          info="Sum of (estimated hours − tracked hours) for all open tasks. Gives a forward-looking forecast of remaining workload — useful for capacity planning and deadline risk assessment."
          onAskAI={() => openChatWithQuery(`We have ${Math.max(0, Math.round(tasks.filter((t) => t.status !== "done").reduce((s, t) => s + Math.max((t.estimatedHours ?? 0) - (t.trackedHours ?? 0), 0), 0)))}h of estimated work remaining on open tasks. Will we finish on time, and which tasks are the biggest contributors?`)}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Sprint Velocity" description="Story points completed per sprint" info="Story points successfully completed in each sprint. A rising trend signals improving team throughput; drops may indicate scope issues, team changes, or increased complexity." onAskAI={() => openChatWithQuery("Explain our sprint velocity trend. Is it improving, declining, or stable across sprints, and what's driving the pattern?")}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="points" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Task Completion" description={selectedSprint?.name ?? "Selected sprint"} info="Ratio of completed ('done') tasks vs remaining tasks in the selected sprint. Provides a quick visual read on sprint progress — green is done, grey is remaining." onAskAI={() => openChatWithQuery(`Our task completion for this sprint is ${completion.pct}% (${completion.done} done, ${completion.total - completion.done} remaining). Explain what this signals about our delivery risk.`)}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {completionData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={24} iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution" description="Open tasks in this sprint" info="Open tasks in the current sprint categorized by delivery risk: On Track (within deadline), At Risk (tight timeline), or Overdue (past due date). A large 'At Risk' or 'Overdue' bar warrants immediate attention." onAskAI={() => openChatWithQuery(`Our risk distribution shows ${risk.on_track} on track, ${risk.at_risk} at risk, and ${risk.overdue} overdue tasks. Explain the risk picture and what we should prioritize.`)}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Team Workload" description="Open tasks and story points per assignee" info="Story points and task count currently assigned to each team member. Use this to spot overloaded members (high bars) and underutilized ones — imbalance is a common cause of sprint delays." onAskAI={() => openChatWithQuery("Analyze our team workload distribution. Who is overloaded, who has capacity, and should we rebalance any assignments?")}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={workloadData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={70} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="points" name="Story Points" fill="#2563eb" radius={[0, 4, 4, 0]} />
              <Bar dataKey="tasks" name="Tasks" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sprint Burndown" description={`Ideal vs actual remaining points · ${selectedSprint?.name ?? ""}`} info="Compares ideal (linear) vs actual remaining story points day-by-day. The gap between the lines reveals pace: actual above ideal = behind schedule, actual below = ahead. Flat stretches indicate days with no completions." onAskAI={() => openChatWithQuery("Explain our sprint burndown chart. Are we ahead or behind the ideal line, what does the slope tell us, and are there any concerning flat stretches?")}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={burndownData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="ideal" name="Ideal" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Estimation accuracy per member */}
      {accuracyChartData.length > 0 && (
        <ChartCard
          title="Estimation Bias per Member"
          description="Tracked vs estimated on completed tasks — positive = over, negative = under"
          info="Shows how much each team member's estimates deviated from actual time spent, on average. Positive % = consistently underestimated (work took longer); Negative % = overestimated. Helps pinpoint who needs estimation calibration."
          onAskAI={() => openChatWithQuery("Which team members have the biggest estimation bias, what does it mean for planning, and what should we do about it?")}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={accuracyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                formatter={(value, _name, item) => {
                  const v = Number(value);
                  const count = (item?.payload as { count?: number } | undefined)?.count ?? 0;
                  return [
                    `${v > 0 ? "+" : ""}${v}%`,
                    `Variance (${count} task${count === 1 ? "" : "s"})`,
                  ];
                }}
              />
              <Bar dataKey="overPct" radius={[4, 4, 0, 0]}>
                {accuracyChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Charts Row 3 */}
      <ChartCard title="Blockers Over Time" description="Daily count of detected blockers (resolved + unresolved)" info="Daily count of blockers detected across all sprints, including both resolved and unresolved ones. Spikes often correlate with sprint phases where external dependencies or integration work surfaces hidden risks." onAskAI={() => openChatWithQuery("Explain the blockers over time chart. Are we seeing a rising trend, a spike, or a healthy decline — and what does the pattern tell us?")}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={blockersData.map((d) => ({ ...d, date: formatDate(d.date) }))} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
