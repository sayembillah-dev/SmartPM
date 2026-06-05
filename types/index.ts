export interface Project {
  id: string;
  name: string;
  description?: string;
}

export type Status = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export type Priority = "critical" | "high" | "medium" | "low";

export type RiskLevel = "on_track" | "at_risk" | "overdue";

export type SprintStatus = "closed" | "active" | "future";

export type TaskType = "bug" | "feature" | "chore" | "spike";

export type TransitionKind = "status" | "sprint_move" | "assignee_change";

// Audit entry recording a meaningful change on a task.
// - kind="status": from/to are Status values (or null for the initial entry).
// - kind="sprint_move": from/to are sprintId values.
// - kind="assignee_change": from/to are memberId values or null when unassigned.
export interface StatusTransition {
  kind: TransitionKind;
  from: string | null;
  to: string | null;
  at: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: Status;
  assigneeId: string | null;
  priority: Priority;
  storyPoints: 1 | 2 | 3 | 5 | 8;
  dueDate: string;
  sprintId: string;
  dependsOn?: string[];
  estimatedHours?: number;
  trackedHours?: number;
  createdAt: string;
  lastStatusChangeAt: string;
  type?: TaskType;
  goalIds?: string[];
  statusHistory?: StatusTransition[];
}

export type GoalKind = "goal" | "milestone";

export type GoalStatus = "on_track" | "at_risk" | "missed" | "achieved";

export type GoalQuarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface Goal {
  id: string;
  projectId: string;
  name: string;
  kind: GoalKind;
  quarter: GoalQuarter;
  year: number;
  targetDate: string; // YYYY-MM-DD
  status: GoalStatus;
  description?: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  plannedPoints?: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  description?: string;
  avatarInitial: string;
  weeklyCapacityPoints: number;
}

export interface ProjectMembership {
  projectId: string;
  employeeId: string;
}

// Resolved view: an Employee scoped to a Project. The provider derives this
// from (memberships × employees) for the active project. TeamMember.id ===
// Employee.id, so existing assigneeId references continue to work.
export interface TeamMember {
  id: string;
  projectId: string;
  name: string;
  role: string;
  description?: string;
  avatarInitial: string;
  weeklyCapacityPoints: number;
}

export interface BlockerLog {
  id: string;
  taskId: string;
  detectedAt: string;
  description: string;
  suggestion: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  rationale: string;
}

export interface AssignmentSuggestion {
  memberId: string;
  rationale: string;
}

export interface TeamLoad {
  memberId: string;
  taskCount: number;
  storyPoints: number;
}

export interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number;
}

export type ToolName =
  | "update_task_status"
  | "reassign_task"
  | "unassign_task"
  | "add_task_dependency"
  | "remove_task_dependency"
  | "create_task"
  | "move_task_to_sprint"
  | "set_task_goals";

export type ToolCallStatus = "pending" | "confirmed" | "cancelled" | "failed" | "superseded";

export interface ToolCallProposal {
  id: string;
  name: ToolName;
  args: Record<string, unknown>;
  status: ToolCallStatus;
  result?: string;
}

export type VerdictLevel = "healthy" | "watch" | "concerning";

export interface SummaryReport {
  verdict: {
    level: VerdictLevel;
    headline: string;
  };
  kpis: {
    pointsDone: number;
    pointsPlanned: number;
    completedTasks: number;
    inProgressTasks: number;
    blockersCount: number;
    riskCount: number;
  };
  completed: { taskId: string }[];
  inProgress: { taskId: string; risk: RiskLevel; note?: string }[];
  blockers: { blockerId: string; suggestedAction: string }[];
  risks: { taskId: string; rationale: string }[];
  recommendations: { action: string; reason?: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallProposal[];
}
