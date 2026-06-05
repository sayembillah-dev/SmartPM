import type {
  AssignmentSuggestion,
  BlockerLog,
  BurndownPoint,
  Goal,
  Priority,
  RiskAssessment,
  Sprint,
  Status,
  Task,
  TaskType,
  TeamLoad,
  TeamMember,
} from "@/types";

// ──────────────────────────── Date helpers ────────────────────────────

export function daysBetween(from: string, to: string): number {
  const a = new Date(from + "T00:00:00Z").getTime();
  const b = new Date(to + "T00:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function addDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// ──────────────────────────── Team load ────────────────────────────

export function computeTeamLoad(tasks: Task[], team: TeamMember[]): TeamLoad[] {
  const open = tasks.filter((t) => t.status !== "done" && t.assigneeId !== null);
  return team.map((m) => {
    const mine = open.filter((t) => t.assigneeId === m.id);
    return {
      memberId: m.id,
      taskCount: mine.length,
      storyPoints: mine.reduce((sum, t) => sum + t.storyPoints, 0),
    };
  });
}

// ──────────────────────────── Auto-assignment ────────────────────────────

// Coarse domain inference for fit-scoring. Heuristic only — the chat AI does
// richer reasoning via the team-profile prompt.
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  frontend: [
    "modal", "page", "view", "form", "dropdown", "ui", "component", "layout",
    "responsive", "filter bar", "dashboard", "chart", "card", "drag", "kanban",
    "shadcn", "tailwind", "react", "tour", "onboarding",
  ],
  backend: [
    "api", "endpoint", "database", "schema", "migration", "auth", "oauth", "jwt",
    "rate limit", "graphql", "rbac", "audit log", "session", "permissions",
    "rest", "service", "webhook",
  ],
  mobile: [
    "mobile", "ios", "android", "apns", "push notification", "keychain", "native",
    "react native", "provisioning",
  ],
  qa: [
    "qa", "test", "testing", "regression", "edge case", "a11y", "accessibility",
    "smoke test", "release", "audit", "wcag",
  ],
  ml: [
    "nlp", "ml", "classifier", "intent", "embedding", "ai router", "classification",
    "model", "vector",
  ],
  design: [
    "design", "visual", "style guide", "tokens", "motion", "ux", "wireframe",
    "spec", "storybook",
  ],
  data: ["analytics", "viz", "recharts", "d3", "chart", "burndown", "metric"],
};

const ROLE_DOMAIN: Record<string, string[]> = {
  "frontend engineer": ["frontend"],
  "backend engineer": ["backend"],
  "full-stack engineer": ["frontend", "backend"],
  "mobile engineer": ["mobile"],
  "qa engineer": ["qa"],
  "product designer": ["design"],
  "ml engineer": ["ml"],
  "data scientist": ["ml", "data"],
  "devops engineer": ["backend"],
};

function inferDomains(text: string): Set<string> {
  const lower = text.toLowerCase();
  const out = new Set<string>();
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) out.add(domain);
  }
  return out;
}

function memberDomains(member: TeamMember): Set<string> {
  const fromRole = ROLE_DOMAIN[member.role.toLowerCase()] ?? [];
  const fromDesc = member.description ? inferDomains(member.description) : new Set<string>();
  return new Set([...fromRole, ...fromDesc]);
}

function taskDomains(task: Task): Set<string> {
  return inferDomains(`${task.title} ${task.description ?? ""}`);
}

export function suggestAssignee(
  task: Task,
  team: TeamMember[],
  allTasks: Task[]
): AssignmentSuggestion | null {
  if (task.assigneeId) return null;
  if (team.length === 0) return null;

  const tDomains = taskDomains(task);
  const loads = computeTeamLoad(allTasks, team);
  const accuracy = accuracyByMember(allTasks, team);

  const scored = team.map((m) => {
    const mDomains = memberDomains(m);
    const overlap = [...tDomains].filter((d) => mDomains.has(d)).length;
    const skillScore = tDomains.size === 0 ? 0.5 : overlap / tDomains.size;

    const load = loads.find((l) => l.memberId === m.id);
    const loadFrac =
      load && m.weeklyCapacityPoints > 0 ? load.storyPoints / m.weeklyCapacityPoints : 0;
    const loadScore = Math.max(0, 1 - loadFrac);

    const memberAcc = accuracy.find((a) => a.memberId === m.id);
    const accuracyScore = memberAcc
      ? Math.max(0, 1 - Math.min(1, Math.abs(memberAcc.varianceRatio - 1)))
      : 0.6;

    const total = skillScore * 0.55 + loadScore * 0.3 + accuracyScore * 0.15;

    return {
      member: m,
      load,
      memberAcc,
      mDomains,
      overlap,
      skillScore,
      loadScore,
      accuracyScore,
      total,
    };
  });

  const sorted = [...scored].sort((a, b) => b.total - a.total);
  const winner = sorted[0];
  if (!winner) return null;

  const first = winner.member.name.split(" ")[0];
  const parts: string[] = [];

  if (tDomains.size === 0) {
    parts.push("best available");
  } else if (winner.overlap > 0) {
    const matched = [...tDomains].find((d) => winner.mDomains.has(d));
    if (matched) parts.push(`${matched} fit`);
  } else {
    parts.push("no clear skill match");
  }

  if (winner.load) {
    parts.push(`${winner.load.storyPoints}/${winner.member.weeklyCapacityPoints} pts load`);
  }

  if (winner.memberAcc && winner.memberAcc.count >= 2) {
    const v = winner.memberAcc.varianceRatio;
    if (Math.abs(v - 1) < 0.1) parts.push("accurate estimator");
    else if (v > 1) parts.push(`runs ~${Math.round((v - 1) * 100)}% over`);
    else parts.push(`runs ~${Math.round((1 - v) * 100)}% under`);
  }

  return {
    memberId: winner.member.id,
    rationale: `${first} — ${parts.join(", ")}.`,
  };
}

// ──────────────────────────── Blocker detection ────────────────────────────

const STALL_THRESHOLD_DAYS = 3;

export function detectBlockers(tasks: Task[], today: string): BlockerLog[] {
  const detected: BlockerLog[] = [];

  for (const task of tasks) {
    // Heuristic 1: in_progress and stalled
    if (task.status === "in_progress") {
      const stalled = daysBetween(task.lastStatusChangeAt, today);
      if (stalled > STALL_THRESHOLD_DAYS) {
        detected.push({
          id: `auto-stall-${task.id}`,
          taskId: task.id,
          detectedAt: today,
          description: `Task has been In Progress for ${stalled} days with no status change.`,
          suggestion: "Sync with the assignee — check for hidden blockers or scope creep.",
          resolved: false,
        });
      }
    }

    // Heuristic 2: depends on a task still in Backlog/To Do
    if (task.dependsOn?.length && task.status !== "done") {
      const blockingDeps = task.dependsOn
        .map((depId) => tasks.find((t) => t.id === depId))
        .filter((t): t is Task => !!t && (t.status === "backlog" || t.status === "todo"));
      if (blockingDeps.length > 0) {
        detected.push({
          id: `auto-dep-${task.id}`,
          taskId: task.id,
          detectedAt: today,
          description: `Blocked by ${blockingDeps.map((d) => `"${d.title}"`).join(", ")} — still in ${blockingDeps[0].status === "backlog" ? "Backlog" : "To Do"}.`,
          suggestion: `Pull the blocking task(s) forward or reassign for parallel work.`,
          resolved: false,
        });
      }
    }
  }

  return detected;
}

// ──────────────────────────── Risk scoring ────────────────────────────

export function scoreRisk(task: Task, today: string, allTasks: Task[], team: TeamMember[]): RiskAssessment {
  if (task.status === "done") {
    return { level: "on_track", rationale: "Completed." };
  }

  const daysLeft = daysBetween(today, task.dueDate);

  // Overdue: due date passed and not done
  if (daysLeft < 0) {
    return {
      level: "overdue",
      rationale: `Due date passed by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} and still ${humanStatus(task.status)}.`,
    };
  }

  // At risk: tight ratio of points to days, heavy load, or unresolved blocker
  const reasons: string[] = [];

  if (daysLeft > 0 && task.storyPoints / Math.max(daysLeft, 1) >= 2) {
    reasons.push(`${task.storyPoints} pts left with only ${daysLeft} day${daysLeft === 1 ? "" : "s"}`);
  }

  if (task.assigneeId) {
    const loads = computeTeamLoad(allTasks, team);
    const myLoad = loads.find((l) => l.memberId === task.assigneeId);
    const member = team.find((m) => m.id === task.assigneeId);
    if (myLoad && member && myLoad.storyPoints > member.weeklyCapacityPoints) {
      reasons.push(`assignee over capacity (${myLoad.storyPoints} / ${member.weeklyCapacityPoints} pts)`);
    }
  }

  // Stalled in progress
  if (task.status === "in_progress" && daysBetween(task.lastStatusChangeAt, today) > STALL_THRESHOLD_DAYS) {
    reasons.push(`stalled ${daysBetween(task.lastStatusChangeAt, today)} days`);
  }

  // Blocked by unfinished dependency
  if (task.dependsOn?.length) {
    const blocking = task.dependsOn
      .map((id) => allTasks.find((t) => t.id === id))
      .filter((t): t is Task => !!t && t.status !== "done");
    if (blocking.length > 0) {
      reasons.push(`blocked by ${blocking.length} unfinished dep${blocking.length === 1 ? "" : "s"}`);
    }
  }

  if (reasons.length > 0) {
    return { level: "at_risk", rationale: capitalize(reasons.join(", ")) + "." };
  }

  return {
    level: "on_track",
    rationale: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left, ${task.storyPoints} pt${task.storyPoints === 1 ? "" : "s"} of work.`,
  };
}

function humanStatus(s: Task["status"]): string {
  return s === "in_progress" ? "In Progress" : s === "in_review" ? "In Review" : s === "todo" ? "To Do" : s === "backlog" ? "Backlog" : "Done";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ──────────────────────────── Analytics helpers ────────────────────────────

export function sprintVelocity(tasks: Task[], sprint: Sprint): number {
  return tasks
    .filter((t) => t.sprintId === sprint.id && t.status === "done")
    .reduce((sum, t) => sum + t.storyPoints, 0);
}

export function completionRate(tasks: Task[], sprintId: string): { done: number; total: number; pct: number } {
  const sprintTasks = tasks.filter((t) => t.sprintId === sprintId);
  const done = sprintTasks.filter((t) => t.status === "done").length;
  const total = sprintTasks.length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function avgCycleTimeDays(tasks: Task[]): number {
  const completed = tasks.filter((t) => t.status === "done");
  if (completed.length === 0) return 0;
  const total = completed.reduce((sum, t) => sum + Math.max(daysBetween(t.createdAt, t.lastStatusChangeAt), 0), 0);
  return Math.round((total / completed.length) * 10) / 10;
}

export function burndown(sprint: Sprint, tasks: Task[], today: string): BurndownPoint[] {
  const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
  const total = sprintTasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const lengthDays = daysBetween(sprint.startDate, sprint.endDate);
  const points: BurndownPoint[] = [];

  for (let i = 0; i <= lengthDays; i++) {
    const day = addDays(sprint.startDate, i);
    const ideal = Math.max(total - (total / lengthDays) * i, 0);

    let actual: number;
    if (day > today && sprint.status !== "closed") {
      // future days — no actual yet
      actual = NaN;
    } else {
      const completedByDay = sprintTasks
        .filter((t) => t.status === "done" && t.lastStatusChangeAt <= day)
        .reduce((sum, t) => sum + t.storyPoints, 0);
      actual = total - completedByDay;
    }

    points.push({ date: day, ideal: Math.round(ideal * 10) / 10, actual });
  }

  return points;
}

export function blockersOverTime(blockers: BlockerLog[]): { date: string; count: number }[] {
  const byDate = new Map<string, number>();
  for (const b of blockers) {
    byDate.set(b.detectedAt, (byDate.get(b.detectedAt) ?? 0) + 1);
  }
  return [...byDate.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}

export interface EstimationAccuracy {
  count: number;
  estimatedTotal: number;
  trackedTotal: number;
  varianceRatio: number; // tracked / estimated, e.g. 1.2 = 20% over
  meanAbsErrorPct: number; // average |tracked - est| / est across tasks, 0–100+
}

export function estimationAccuracy(tasks: Task[]): EstimationAccuracy {
  const completed = tasks.filter(
    (t) =>
      t.status === "done" &&
      typeof t.estimatedHours === "number" &&
      t.estimatedHours > 0 &&
      typeof t.trackedHours === "number"
  );
  if (completed.length === 0) {
    return { count: 0, estimatedTotal: 0, trackedTotal: 0, varianceRatio: 1, meanAbsErrorPct: 0 };
  }
  let estimatedTotal = 0;
  let trackedTotal = 0;
  let absErrorPctSum = 0;
  for (const t of completed) {
    const est = t.estimatedHours!;
    const trk = t.trackedHours!;
    estimatedTotal += est;
    trackedTotal += trk;
    absErrorPctSum += Math.abs(trk - est) / est;
  }
  return {
    count: completed.length,
    estimatedTotal: Math.round(estimatedTotal * 10) / 10,
    trackedTotal: Math.round(trackedTotal * 10) / 10,
    varianceRatio: estimatedTotal > 0 ? Math.round((trackedTotal / estimatedTotal) * 100) / 100 : 1,
    meanAbsErrorPct: Math.round((absErrorPctSum / completed.length) * 100),
  };
}

export interface MemberAccuracy {
  memberId: string;
  count: number;
  varianceRatio: number;
}

export function accuracyByMember(tasks: Task[], team: TeamMember[]): MemberAccuracy[] {
  return team
    .map((m) => {
      const mine = tasks.filter(
        (t) =>
          t.assigneeId === m.id &&
          t.status === "done" &&
          typeof t.estimatedHours === "number" &&
          t.estimatedHours > 0 &&
          typeof t.trackedHours === "number"
      );
      if (mine.length === 0) return { memberId: m.id, count: 0, varianceRatio: 1 };
      const est = mine.reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
      const trk = mine.reduce((s, t) => s + (t.trackedHours ?? 0), 0);
      return {
        memberId: m.id,
        count: mine.length,
        varianceRatio: est > 0 ? Math.round((trk / est) * 100) / 100 : 1,
      };
    })
    .filter((m) => m.count > 0);
}

export function riskDistribution(tasks: Task[], today: string, team: TeamMember[]): { on_track: number; at_risk: number; overdue: number } {
  const dist = { on_track: 0, at_risk: 0, overdue: 0 };
  for (const t of tasks) {
    if (t.status === "done") continue;
    const r = scoreRisk(t, today, tasks, team);
    dist[r.level] += 1;
  }
  return dist;
}

// ──────────────────────────── PM-persona analytics ────────────────────────────

// When did a task enter its current status? Prefers the latest status-transition
// in statusHistory; falls back to lastStatusChangeAt for legacy rows.
function enteredCurrentStatusAt(task: Task): string {
  const history = task.statusHistory;
  if (history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (entry.kind === "status" && entry.to === task.status) {
        return entry.at;
      }
    }
  }
  return task.lastStatusChangeAt;
}

// First time the task reached the "done" status, for accurate cycle time.
function firstDoneAt(task: Task): string | null {
  const history = task.statusHistory;
  if (history && history.length > 0) {
    for (const entry of history) {
      if (entry.kind === "status" && entry.to === "done") return entry.at;
    }
  }
  return task.status === "done" ? task.lastStatusChangeAt : null;
}

export interface StaleTaskRow {
  task: Task;
  daysInStatus: number;
  status: Status;
}

export function tasksStaleInStatus(
  tasks: Task[],
  today: string,
  thresholdDays = 3
): StaleTaskRow[] {
  const out: StaleTaskRow[] = [];
  for (const t of tasks) {
    if (t.status === "done") continue;
    const since = enteredCurrentStatusAt(t);
    const days = daysBetween(since, today);
    if (days > thresholdDays) {
      out.push({ task: t, daysInStatus: days, status: t.status });
    }
  }
  return out.sort((a, b) => b.daysInStatus - a.daysInStatus);
}

export function highPriorityUnstarted(
  tasks: Task[],
  today: string,
  withinHours = 48
): Task[] {
  const cutoffDays = withinHours / 24;
  return tasks
    .filter((t) => {
      if (t.priority !== "critical" && t.priority !== "high") return false;
      if (t.status !== "backlog" && t.status !== "todo") return false;
      const daysToDue = daysBetween(today, t.dueDate);
      return daysToDue <= cutoffDays;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// Transitive count of tasks that depend on each task (incl. indirect). O(N + E).
export function dependencyImpact(tasks: Task[]): Map<string, number> {
  const dependents = new Map<string, string[]>();
  for (const t of tasks) {
    for (const dep of t.dependsOn ?? []) {
      const arr = dependents.get(dep) ?? [];
      arr.push(t.id);
      dependents.set(dep, arr);
    }
  }
  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  function count(id: string): number {
    const cached = memo.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return 0; // guard against any cycles
    visiting.add(id);
    const children = dependents.get(id) ?? [];
    const visited = new Set<string>();
    for (const child of children) {
      visited.add(child);
      // walk descendants
      const stack = [child];
      while (stack.length) {
        const cur = stack.pop()!;
        for (const grand of dependents.get(cur) ?? []) {
          if (!visited.has(grand)) {
            visited.add(grand);
            stack.push(grand);
          }
        }
      }
    }
    visiting.delete(id);
    memo.set(id, visited.size);
    return visited.size;
  }

  for (const t of tasks) count(t.id);
  return memo;
}

export interface OverdueBlockerRow {
  task: Task;
  downstreamCount: number;
}

export function overdueBlockingMostDownstream(
  tasks: Task[],
  today: string
): OverdueBlockerRow[] {
  const impact = dependencyImpact(tasks);
  const overdue = tasks.filter(
    (t) => t.status !== "done" && daysBetween(today, t.dueDate) < 0
  );
  return overdue
    .map((task) => ({ task, downstreamCount: impact.get(task.id) ?? 0 }))
    .sort((a, b) => b.downstreamCount - a.downstreamCount);
}

export interface WorkloadImbalance {
  gini: number;
  stdev: number;
  mean: number;
  hottest: { memberId: string; name: string; points: number } | null;
  coldest: { memberId: string; name: string; points: number } | null;
}

export function workloadImbalance(
  team: TeamMember[],
  tasks: Task[],
  sprintId: string
): WorkloadImbalance {
  const sprintOpen = tasks.filter((t) => t.sprintId === sprintId && t.status !== "done");
  const pointsByMember = team.map((m) => ({
    memberId: m.id,
    name: m.name,
    points: sprintOpen
      .filter((t) => t.assigneeId === m.id)
      .reduce((sum, t) => sum + t.storyPoints, 0),
  }));

  const values = pointsByMember.map((p) => p.points);
  const n = values.length;
  if (n === 0) {
    return { gini: 0, stdev: 0, mean: 0, hottest: null, coldest: null };
  }
  const mean = values.reduce((s, v) => s + v, 0) / n;

  let varianceSum = 0;
  for (const v of values) varianceSum += (v - mean) * (v - mean);
  const stdev = n > 1 ? Math.sqrt(varianceSum / (n - 1)) : 0;

  let absDiff = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      absDiff += Math.abs(values[i] - values[j]);
    }
  }
  const gini = mean > 0 ? absDiff / (2 * n * n * mean) : 0;

  const sorted = [...pointsByMember].sort((a, b) => b.points - a.points);
  const hottest = sorted[0] ?? null;
  const coldest = sorted[sorted.length - 1] ?? null;

  return {
    gini: Math.round(gini * 100) / 100,
    stdev: Math.round(stdev * 10) / 10,
    mean: Math.round(mean * 10) / 10,
    hottest,
    coldest,
  };
}

export interface CycleTimeByType {
  bug: number;
  feature: number;
  chore: number;
  spike: number;
  bugVsFeatureDelta: number;
  counts: { bug: number; feature: number; chore: number; spike: number };
}

export function cycleTimeByType(tasks: Task[]): CycleTimeByType {
  const sums: Record<TaskType, number> = { bug: 0, feature: 0, chore: 0, spike: 0 };
  const counts: Record<TaskType, number> = { bug: 0, feature: 0, chore: 0, spike: 0 };

  for (const t of tasks) {
    if (t.status !== "done" || !t.type) continue;
    const doneAt = firstDoneAt(t);
    if (!doneAt) continue;
    const days = Math.max(daysBetween(t.createdAt, doneAt), 0);
    sums[t.type] += days;
    counts[t.type] += 1;
  }

  const avg = (k: TaskType) => (counts[k] > 0 ? Math.round((sums[k] / counts[k]) * 10) / 10 : 0);
  const bug = avg("bug");
  const feature = avg("feature");

  return {
    bug,
    feature,
    chore: avg("chore"),
    spike: avg("spike"),
    bugVsFeatureDelta: Math.round((bug - feature) * 10) / 10,
    counts: { ...counts },
  };
}

export interface MilestoneForecast {
  pointsRemaining: number;
  expectedPointsPerSprint: number;
  sprintsNeeded: number;
  sprintLengthDays: number;
  projectedDate: string;
  willHit: boolean;
  confidence: "low" | "medium" | "high";
}

export function milestoneForecast(
  sprints: Sprint[],
  tasks: Task[],
  goal: Goal,
  today: string,
  lastN = 3
): MilestoneForecast {
  const closed = sprints
    .filter((s) => s.status === "closed")
    .sort((a, b) => b.endDate.localeCompare(a.endDate))
    .slice(0, lastN);

  const velocities = closed.map((s) => sprintVelocity(tasks, s));
  const mean =
    velocities.length > 0 ? velocities.reduce((s, v) => s + v, 0) / velocities.length : 0;
  const lengths = closed.map((s) => Math.max(daysBetween(s.startDate, s.endDate), 1));
  const avgLen =
    lengths.length > 0 ? lengths.reduce((s, v) => s + v, 0) / lengths.length : 14;

  const goalTasks = tasks.filter((t) => (t.goalIds ?? []).includes(goal.id));
  const pointsRemaining = goalTasks
    .filter((t) => t.status !== "done")
    .reduce((sum, t) => sum + t.storyPoints, 0);

  const expected = Math.round(mean * 10) / 10;
  const sprintsNeeded =
    mean > 0 ? Math.ceil(pointsRemaining / mean) : pointsRemaining > 0 ? Infinity : 0;

  const projectedDate =
    Number.isFinite(sprintsNeeded) && sprintsNeeded > 0
      ? addDays(today, Math.round(sprintsNeeded * avgLen))
      : today;

  const willHit =
    Number.isFinite(sprintsNeeded) && projectedDate <= goal.targetDate;

  // Confidence: stdev/mean of velocities. <10% high, >30% low, else medium.
  let confidence: "low" | "medium" | "high" = "medium";
  if (velocities.length < 2 || mean === 0) {
    confidence = "low";
  } else {
    let varianceSum = 0;
    for (const v of velocities) varianceSum += (v - mean) * (v - mean);
    const sd = Math.sqrt(varianceSum / (velocities.length - 1));
    const cv = mean > 0 ? sd / mean : 1;
    if (cv < 0.1) confidence = "high";
    else if (cv > 0.3) confidence = "low";
  }

  return {
    pointsRemaining,
    expectedPointsPerSprint: expected,
    sprintsNeeded: Number.isFinite(sprintsNeeded) ? sprintsNeeded : 999,
    sprintLengthDays: Math.round(avgLen),
    projectedDate,
    willHit,
    confidence,
  };
}

export function goalAlignment(
  tasks: Task[],
  goalId: string
): { aligned: number; total: number; pct: number } {
  const open = tasks.filter((t) => t.status !== "done");
  const aligned = open.filter((t) => (t.goalIds ?? []).includes(goalId)).length;
  const total = open.length;
  return { aligned, total, pct: total > 0 ? Math.round((aligned / total) * 100) : 0 };
}

export interface ScopeCreepRow {
  task: Task;
  addedAt: string;
  mode: "transition" | "createdAt";
}

export function scopeCreepEvents(sprint: Sprint, tasks: Task[]): ScopeCreepRow[] {
  const out: ScopeCreepRow[] = [];
  for (const t of tasks) {
    if (t.sprintId !== sprint.id) continue;
    // Prefer a sprint_move transition INTO this sprint after the sprint started.
    let moveAt: string | null = null;
    for (const entry of t.statusHistory ?? []) {
      if (entry.kind === "sprint_move" && entry.to === sprint.id && entry.at > sprint.startDate) {
        moveAt = entry.at;
      }
    }
    if (moveAt) {
      out.push({ task: t, addedAt: moveAt, mode: "transition" });
      continue;
    }
    // Fallback: created after the sprint started.
    if (t.createdAt > sprint.startDate) {
      out.push({ task: t, addedAt: t.createdAt, mode: "createdAt" });
    }
  }
  return out.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export interface ReopenedRow {
  task: Task;
  reopens: number;
  lastReopenAt: string | null;
}

export function reopenedTasks(tasks: Task[]): ReopenedRow[] {
  const out: ReopenedRow[] = [];
  for (const t of tasks) {
    let reopens = 0;
    let last: string | null = null;
    for (const entry of t.statusHistory ?? []) {
      if (entry.kind === "status" && entry.from === "done" && entry.to !== "done") {
        reopens += 1;
        last = entry.at;
      }
    }
    if (reopens > 0) out.push({ task: t, reopens, lastReopenAt: last });
  }
  return out.sort((a, b) => b.reopens - a.reopens);
}

const PRIORITY_WEIGHT: Record<Priority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function weeklyAccomplishments(
  tasks: Task[],
  today: string,
  daysWindow = 7,
  n = 3
): Task[] {
  const windowStart = addDays(today, -daysWindow);
  const candidates = tasks.filter((t) => {
    if (t.status !== "done") return false;
    const doneAt = firstDoneAt(t) ?? t.lastStatusChangeAt;
    return doneAt >= windowStart && doneAt <= today;
  });
  candidates.sort((a, b) => {
    const aScore = a.storyPoints * PRIORITY_WEIGHT[a.priority];
    const bScore = b.storyPoints * PRIORITY_WEIGHT[b.priority];
    return bScore - aScore;
  });
  return candidates.slice(0, n);
}

export interface CutCandidate {
  task: Task;
  hoursFreed: number;
  reason: string;
}

// Suggest the lowest-impact non-done tasks to cut to pull a deadline in by N days.
// Lowest-impact = lower priority + fewer downstream dependents.
export function cutCandidates(
  tasks: Task[],
  team: TeamMember[],
  daysToPullIn: number,
  options?: { excludeStatus?: Status[]; hoursPerDayPerMember?: number }
): CutCandidate[] {
  const exclude = new Set(options?.excludeStatus ?? ["done"]);
  const hoursPerDayPerMember = options?.hoursPerDayPerMember ?? 6;
  const targetHours = Math.max(daysToPullIn, 0) * team.length * hoursPerDayPerMember;
  if (targetHours === 0) return [];

  const impact = dependencyImpact(tasks);

  const ranked = tasks
    .filter((t) => !exclude.has(t.status))
    .map((t) => ({
      task: t,
      hoursFreed:
        typeof t.estimatedHours === "number"
          ? Math.max(t.estimatedHours - (t.trackedHours ?? 0), 0)
          : t.storyPoints * 4,
      priorityWeight: PRIORITY_WEIGHT[t.priority],
      downstream: impact.get(t.id) ?? 0,
    }))
    .sort((a, b) => {
      if (a.priorityWeight !== b.priorityWeight) return a.priorityWeight - b.priorityWeight;
      if (a.downstream !== b.downstream) return a.downstream - b.downstream;
      return b.hoursFreed - a.hoursFreed;
    });

  const out: CutCandidate[] = [];
  let acc = 0;
  for (const row of ranked) {
    if (acc >= targetHours) break;
    if (row.hoursFreed <= 0) continue;
    const reasonParts: string[] = [];
    reasonParts.push(`${row.task.priority} priority`);
    if (row.downstream === 0) reasonParts.push("no downstream impact");
    else reasonParts.push(`${row.downstream} downstream`);
    out.push({
      task: row.task,
      hoursFreed: Math.round(row.hoursFreed * 10) / 10,
      reason: reasonParts.join(", "),
    });
    acc += row.hoursFreed;
  }
  return out;
}
