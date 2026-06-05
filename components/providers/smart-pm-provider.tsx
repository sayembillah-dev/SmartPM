"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  blockerLog as seedBlockers,
  DEFAULT_PROJECT_ID,
  employees as seedEmployees,
  goals as seedGoals,
  projectMemberships as seedMemberships,
  projects as seedProjects,
  sprints as seedSprints,
  tasks as seedTasks,
  TODAY,
} from "@/lib/dummy-data";
import type {
  BlockerLog,
  ChatMessage,
  Employee,
  Goal,
  Priority,
  Project,
  ProjectMembership,
  Sprint,
  Status,
  StatusTransition,
  Task,
  TeamMember,
} from "@/types";

export interface MutationResult {
  ok: boolean;
  error?: string;
}

export type EmployeeDraft = Omit<Employee, "id" | "avatarInitial"> & {
  avatarInitial?: string;
};

export interface TaskDraft {
  title: string;
  description?: string;
  status?: Status;
  assigneeId?: string | null;
  priority: Priority;
  storyPoints: 1 | 2 | 3 | 5 | 8;
  dueDate: string;
  sprintId: string;
  estimatedHours?: number;
  dependsOn?: string[];
}

const VALID_STATUSES: Status[] = ["backlog", "todo", "in_progress", "in_review", "done"];
const VALID_PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const VALID_STORY_POINTS = [1, 2, 3, 5, 8];

interface SmartPMContextValue {
  today: string;
  projects: Project[];
  selectedProjectId: string;
  selectedProject: Project;
  setSelectedProjectId: (id: string) => void;
  // Global pool
  employees: Employee[];
  memberships: ProjectMembership[];
  // Project-scoped (resolved) team
  team: TeamMember[];
  sprints: Sprint[];
  tasks: Task[];
  blockers: BlockerLog[];
  goals: Goal[];
  selectedSprintId: string;
  setSelectedSprintId: (id: string) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  updateTaskAssignee: (taskId: string, memberId: string | null) => void;
  moveTask: (taskId: string, targetStatus: Status, targetIndex: number) => void;
  updateTaskTime: (taskId: string, time: { estimatedHours?: number | null; trackedHours?: number | null }) => MutationResult;
  updateTaskSprint: (taskId: string, sprintId: string) => MutationResult;
  updateTaskDescription: (taskId: string, description: string | null) => MutationResult;
  addTaskDependency: (taskId: string, dependsOnTaskId: string) => MutationResult;
  removeTaskDependency: (taskId: string, dependsOnTaskId: string) => MutationResult;
  addTask: (draft: TaskDraft) => MutationResult & { id?: string };
  updateTaskGoals: (taskId: string, goalIds: string[]) => MutationResult;
  // Employees (global) — used by /resources
  addEmployee: (draft: EmployeeDraft) => MutationResult & { id?: string };
  updateEmployee: (id: string, updates: Partial<Omit<Employee, "id">>) => MutationResult;
  removeEmployee: (id: string) => MutationResult & { unassignedTaskCount?: number; removedFromProjects?: number };
  // Project membership — used by /team
  addMemberToActiveProject: (employeeId: string) => MutationResult;
  removeMemberFromActiveProject: (employeeId: string) => MutationResult & { unassignedTaskCount?: number };
  // Chat
  isChatOpen: boolean;
  toggleChat: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: (m: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  chatPrefillQuery: string | null;
  openChatWithQuery: (question: string) => void;
  clearChatPrefill: () => void;
}

const SmartPMContext = createContext<SmartPMContextValue | null>(null);

function reachesTarget(from: Task, targetId: string, tasks: Task[]): boolean {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const stack: Task[] = [from];
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.id === targetId) return true;
    if (visited.has(cur.id)) continue;
    visited.add(cur.id);
    for (const depId of cur.dependsOn ?? []) {
      const dep = byId.get(depId);
      if (dep) stack.push(dep);
    }
  }
  return false;
}

function appendTransition(task: Task, transition: StatusTransition): Task {
  return { ...task, statusHistory: [...(task.statusHistory ?? []), transition] };
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function defaultSprintForProject(sprints: Sprint[], projectId: string): string {
  const projectSprints = sprints.filter((s) => s.projectId === projectId);
  return (
    projectSprints.find((s) => s.status === "active")?.id ??
    projectSprints[0]?.id ??
    ""
  );
}

export function SmartPMProvider({ children }: { children: React.ReactNode }) {
  const [allTasks, setAllTasks] = useState<Task[]>(seedTasks);
  const [allEmployees, setAllEmployees] = useState<Employee[]>(seedEmployees);
  const [allMemberships, setAllMemberships] = useState<ProjectMembership[]>(seedMemberships);
  const [allSprints] = useState<Sprint[]>(seedSprints);
  const [allBlockers] = useState<BlockerLog[]>(seedBlockers);
  const [projects] = useState<Project[]>(seedProjects);

  const [selectedProjectId, setSelectedProjectIdState] = useState<string>(DEFAULT_PROJECT_ID);
  const [selectedSprintByProject, setSelectedSprintByProject] = useState<Record<string, string>>(
    () => Object.fromEntries(
      seedProjects.map((p) => [p.id, defaultSprintForProject(seedSprints, p.id)])
    )
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatByProject, setChatByProject] = useState<Record<string, ChatMessage[]>>({});
  const [chatPrefillQuery, setChatPrefillQuery] = useState<string | null>(null);

  const projectIdRef = useRef<string>(selectedProjectId);
  useEffect(() => {
    projectIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  const tasksRef = useRef<Task[]>(allTasks);
  useEffect(() => {
    tasksRef.current = allTasks;
  }, [allTasks]);

  const employeesRef = useRef<Employee[]>(allEmployees);
  useEffect(() => {
    employeesRef.current = allEmployees;
  }, [allEmployees]);

  const membershipsRef = useRef<ProjectMembership[]>(allMemberships);
  useEffect(() => {
    membershipsRef.current = allMemberships;
  }, [allMemberships]);

  const setSelectedProjectId = useCallback((id: string) => {
    setSelectedProjectIdState(id);
    setSelectedSprintByProject((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: defaultSprintForProject(seedSprints, id) };
    });
  }, []);

  const selectedSprintId = selectedSprintByProject[selectedProjectId] ?? "";

  const setSelectedSprintId = useCallback(
    (id: string) => {
      setSelectedSprintByProject((prev) => ({ ...prev, [selectedProjectId]: id }));
    },
    [selectedProjectId]
  );

  const selectedProject = useMemo<Project>(
    () => projects.find((p) => p.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId]
  );

  // ─── Project-scoped derived views ───
  const projectTasks = useMemo(
    () => allTasks.filter((t) => t.projectId === selectedProjectId),
    [allTasks, selectedProjectId]
  );

  const projectTeam = useMemo<TeamMember[]>(() => {
    const empById = new Map(allEmployees.map((e) => [e.id, e]));
    const out: TeamMember[] = [];
    for (const m of allMemberships) {
      if (m.projectId !== selectedProjectId) continue;
      const e = empById.get(m.employeeId);
      if (!e) continue;
      out.push({
        id: e.id,
        projectId: m.projectId,
        name: e.name,
        role: e.role,
        description: e.description,
        avatarInitial: e.avatarInitial,
        weeklyCapacityPoints: e.weeklyCapacityPoints,
      });
    }
    return out;
  }, [allEmployees, allMemberships, selectedProjectId]);

  const projectSprints = useMemo(
    () => allSprints.filter((s) => s.projectId === selectedProjectId),
    [allSprints, selectedProjectId]
  );
  const projectTaskIds = useMemo(() => new Set(projectTasks.map((t) => t.id)), [projectTasks]);
  const projectBlockers = useMemo(
    () => allBlockers.filter((b) => projectTaskIds.has(b.taskId)),
    [allBlockers, projectTaskIds]
  );
  const projectGoals = useMemo<Goal[]>(
    () => seedGoals.filter((g) => g.projectId === selectedProjectId),
    [selectedProjectId]
  );

  // ─── Helpers ───
  const taskInActiveProject = (taskId: string) => {
    const t = tasksRef.current.find((x) => x.id === taskId);
    return t && t.projectId === projectIdRef.current ? t : undefined;
  };

  const employeeInActiveProject = (employeeId: string) => {
    const inProject = membershipsRef.current.some(
      (m) => m.projectId === projectIdRef.current && m.employeeId === employeeId
    );
    return inProject ? employeesRef.current.find((e) => e.id === employeeId) : undefined;
  };

  // ─── Task mutations ───
  const updateTaskStatus = useCallback((taskId: string, status: Status) => {
    if (!taskInActiveProject(taskId)) return;
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.status === status) return t;
        const next = { ...t, status, lastStatusChangeAt: TODAY };
        return appendTransition(next, {
          kind: "status",
          from: t.status,
          to: status,
          at: TODAY,
        });
      })
    );
  }, []);

  const updateTaskAssignee = useCallback((taskId: string, memberId: string | null) => {
    if (!taskInActiveProject(taskId)) return;
    if (memberId && !employeeInActiveProject(memberId)) return;
    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.assigneeId === memberId) return t;
        const next = { ...t, assigneeId: memberId };
        return appendTransition(next, {
          kind: "assignee_change",
          from: t.assigneeId,
          to: memberId,
          at: TODAY,
        });
      })
    );
  }, []);

  const moveTask = useCallback(
    (taskId: string, targetStatus: Status, targetIndex: number) => {
      if (!VALID_STATUSES.includes(targetStatus)) return;
      setAllTasks((prev) => {
        const task = prev.find((t) => t.id === taskId);
        if (!task) return prev;
        if (task.projectId !== projectIdRef.current) return prev;

        const { projectId, sprintId } = task;

        // Tasks in the destination column, in their current global order,
        // excluding the active task itself.
        const columnTasks = prev.filter(
          (t) =>
            t.id !== taskId &&
            t.projectId === projectId &&
            t.sprintId === sprintId &&
            t.status === targetStatus
        );

        const clamped = Math.max(0, Math.min(targetIndex, columnTasks.length));

        // Compute the absolute insertion index inside the flat allTasks array.
        let insertAt: number;
        if (clamped >= columnTasks.length) {
          if (columnTasks.length === 0) {
            // Empty column: place at end of allTasks; relative order doesn't matter.
            insertAt = prev.length;
          } else {
            const last = columnTasks[columnTasks.length - 1];
            insertAt = prev.findIndex((t) => t.id === last.id) + 1;
          }
        } else {
          const anchor = columnTasks[clamped];
          insertAt = prev.findIndex((t) => t.id === anchor.id);
        }

        // Splice the active task out and back in at the computed slot.
        const oldIdx = prev.findIndex((t) => t.id === taskId);
        if (oldIdx === -1) return prev;
        const without = [...prev.slice(0, oldIdx), ...prev.slice(oldIdx + 1)];
        if (oldIdx < insertAt) insertAt -= 1;

        const statusChanged = task.status !== targetStatus;
        let updated: Task = {
          ...task,
          status: targetStatus,
          lastStatusChangeAt: statusChanged ? TODAY : task.lastStatusChangeAt,
        };
        if (statusChanged) {
          updated = appendTransition(updated, {
            kind: "status",
            from: task.status,
            to: targetStatus,
            at: TODAY,
          });
        }

        if (oldIdx === insertAt && !statusChanged) return prev;
        return [...without.slice(0, insertAt), updated, ...without.slice(insertAt)];
      });
    },
    []
  );

  const updateTaskTime = useCallback(
    (taskId: string, time: { estimatedHours?: number | null; trackedHours?: number | null }): MutationResult => {
      const task = taskInActiveProject(taskId);
      if (!task) return { ok: false, error: `Task ${taskId} is not in the active project.` };
      const sanitize = (v: number | null | undefined, current: number | undefined): number | undefined => {
        if (v === undefined) return current;
        if (v === null) return undefined;
        if (!Number.isFinite(v) || v < 0) return current;
        return Math.round(v * 10) / 10;
      };
      const nextEstimated = sanitize(time.estimatedHours, task.estimatedHours);
      const nextTracked = sanitize(time.trackedHours, task.trackedHours);
      setAllTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, estimatedHours: nextEstimated, trackedHours: nextTracked } : t
        )
      );
      return { ok: true };
    },
    []
  );

  const updateTaskDescription = useCallback(
    (taskId: string, description: string | null): MutationResult => {
      const task = taskInActiveProject(taskId);
      if (!task) return { ok: false, error: `Task ${taskId} is not in the active project.` };
      const next = description == null ? undefined : description.trim() || undefined;
      setAllTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, description: next } : t))
      );
      return { ok: true };
    },
    []
  );

  const updateTaskSprint = useCallback(
    (taskId: string, sprintId: string): MutationResult => {
      const activeProject = projectIdRef.current;
      const task = tasksRef.current.find((t) => t.id === taskId);
      if (!task || task.projectId !== activeProject) {
        return { ok: false, error: `Task ${taskId} is not in the active project.` };
      }
      const sprint = seedSprints.find((s) => s.id === sprintId);
      if (!sprint || sprint.projectId !== activeProject) {
        return { ok: false, error: `Sprint ${sprintId} is not in the active project.` };
      }
      if (task.sprintId === sprintId) {
        return { ok: false, error: "Task is already in that sprint." };
      }
      setAllTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const next = { ...t, sprintId };
          return appendTransition(next, {
            kind: "sprint_move",
            from: t.sprintId,
            to: sprintId,
            at: TODAY,
          });
        })
      );
      return { ok: true };
    },
    []
  );

  const addTaskDependency = useCallback(
    (taskId: string, dependsOnTaskId: string): MutationResult => {
      if (taskId === dependsOnTaskId) {
        return { ok: false, error: "A task cannot depend on itself." };
      }
      const activeProject = projectIdRef.current;
      const current = tasksRef.current;
      const task = current.find((t) => t.id === taskId);
      if (!task || task.projectId !== activeProject) {
        return { ok: false, error: `Task ${taskId} is not in the active project.` };
      }
      const dep = current.find((t) => t.id === dependsOnTaskId);
      if (!dep || dep.projectId !== activeProject) {
        return { ok: false, error: `Task ${dependsOnTaskId} is not in the active project.` };
      }
      if (task.dependsOn?.includes(dependsOnTaskId)) {
        return { ok: false, error: "Dependency already exists." };
      }
      const projectScope = current.filter((t) => t.projectId === activeProject);
      if (reachesTarget(dep, taskId, projectScope)) {
        return { ok: false, error: "Adding this dependency would create a cycle." };
      }
      setAllTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, dependsOn: [...(t.dependsOn ?? []), dependsOnTaskId] } : t
        )
      );
      return { ok: true };
    },
    []
  );

  const removeTaskDependency = useCallback(
    (taskId: string, dependsOnTaskId: string): MutationResult => {
      const task = taskInActiveProject(taskId);
      if (!task) return { ok: false, error: `Task ${taskId} is not in the active project.` };
      if (!task.dependsOn?.includes(dependsOnTaskId)) {
        return { ok: false, error: "That dependency does not exist." };
      }
      setAllTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, dependsOn: t.dependsOn?.filter((id) => id !== dependsOnTaskId) }
            : t
        )
      );
      return { ok: true };
    },
    []
  );

  const addTask = useCallback(
    (draft: TaskDraft): MutationResult & { id?: string } => {
      const activeProject = projectIdRef.current;
      const title = draft.title?.trim();
      if (!title) return { ok: false, error: "Title is required." };

      const status: Status = draft.status ?? "todo";
      if (!VALID_STATUSES.includes(status)) {
        return { ok: false, error: `Invalid status: ${status}` };
      }
      if (!VALID_PRIORITIES.includes(draft.priority)) {
        return { ok: false, error: `Invalid priority: ${draft.priority}` };
      }
      if (!VALID_STORY_POINTS.includes(draft.storyPoints)) {
        return { ok: false, error: "Story points must be one of 1, 2, 3, 5, 8." };
      }
      if (!draft.dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate)) {
        return { ok: false, error: "Due date must be in YYYY-MM-DD format." };
      }

      const sprint = seedSprints.find((s) => s.id === draft.sprintId);
      if (!sprint || sprint.projectId !== activeProject) {
        return { ok: false, error: `Sprint ${draft.sprintId} is not in the active project.` };
      }

      if (draft.assigneeId) {
        if (!employeeInActiveProject(draft.assigneeId)) {
          return { ok: false, error: `Member ${draft.assigneeId} is not on the active project.` };
        }
      }

      if (draft.estimatedHours !== undefined) {
        if (!Number.isFinite(draft.estimatedHours) || draft.estimatedHours < 0) {
          return { ok: false, error: "Estimated hours must be 0 or a positive number." };
        }
      }

      if (draft.dependsOn?.length) {
        for (const depId of draft.dependsOn) {
          const dep = tasksRef.current.find((t) => t.id === depId);
          if (!dep || dep.projectId !== activeProject) {
            return { ok: false, error: `Dependency ${depId} is not in the active project.` };
          }
        }
      }

      const existingIds = new Set(tasksRef.current.map((t) => t.id));
      const prefix = activeProject === "p-1" ? "t" : `${activeProject}-t`;
      const projectTaskCount = tasksRef.current.filter((t) => t.projectId === activeProject).length;
      let n = projectTaskCount + 1000;
      let id = `${prefix}-${n}`;
      while (existingIds.has(id)) {
        n += 1;
        id = `${prefix}-${n}`;
      }

      const initialHistory: StatusTransition[] = [
        { kind: "status", from: null, to: status, at: TODAY },
      ];
      if (sprint.status === "active" && sprint.startDate < TODAY) {
        // Created into a sprint that's already running — record a sprint_move to expose scope creep.
        initialHistory.push({ kind: "sprint_move", from: null, to: sprint.id, at: TODAY });
      }

      const task: Task = {
        id,
        projectId: activeProject,
        title,
        description: draft.description?.trim() || undefined,
        status,
        assigneeId: draft.assigneeId ?? null,
        priority: draft.priority,
        storyPoints: draft.storyPoints,
        dueDate: draft.dueDate,
        sprintId: draft.sprintId,
        dependsOn: draft.dependsOn?.length ? [...draft.dependsOn] : undefined,
        estimatedHours: draft.estimatedHours,
        trackedHours: 0,
        createdAt: TODAY,
        lastStatusChangeAt: TODAY,
        type: "feature",
        goalIds: [],
        statusHistory: initialHistory,
      };
      setAllTasks((prev) => [...prev, task]);
      return { ok: true, id };
    },
    []
  );

  const updateTaskGoals = useCallback(
    (taskId: string, goalIds: string[]): MutationResult => {
      const activeProject = projectIdRef.current;
      const task = tasksRef.current.find((t) => t.id === taskId);
      if (!task || task.projectId !== activeProject) {
        return { ok: false, error: `Task ${taskId} is not in the active project.` };
      }
      if (!Array.isArray(goalIds)) {
        return { ok: false, error: "goalIds must be an array." };
      }
      const projectGoalIds = new Set(
        seedGoals.filter((g) => g.projectId === activeProject).map((g) => g.id)
      );
      for (const gid of goalIds) {
        if (!projectGoalIds.has(gid)) {
          return { ok: false, error: `Goal ${gid} is not in the active project.` };
        }
      }
      const deduped = Array.from(new Set(goalIds));
      setAllTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, goalIds: deduped } : t))
      );
      return { ok: true };
    },
    []
  );

  // ─── Employee mutations (global) ───
  const addEmployee = useCallback(
    (draft: EmployeeDraft): MutationResult & { id?: string } => {
      const name = draft.name.trim();
      if (!name) return { ok: false, error: "Name is required." };
      if (!draft.role.trim()) return { ok: false, error: "Role is required." };
      if (draft.weeklyCapacityPoints < 0) {
        return { ok: false, error: "Capacity must be 0 or higher." };
      }
      const existingIds = new Set(employeesRef.current.map((m) => m.id));
      let n = employeesRef.current.length + 1;
      let id = `emp-${n}`;
      while (existingIds.has(id)) {
        n += 1;
        id = `emp-${n}`;
      }
      const employee: Employee = {
        id,
        name,
        role: draft.role.trim(),
        description: draft.description?.trim() || undefined,
        avatarInitial: (draft.avatarInitial?.trim() || deriveInitials(name)).slice(0, 3).toUpperCase(),
        weeklyCapacityPoints: draft.weeklyCapacityPoints,
      };
      setAllEmployees((prev) => [...prev, employee]);
      return { ok: true, id };
    },
    []
  );

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Omit<Employee, "id">>): MutationResult => {
      const current = employeesRef.current.find((e) => e.id === id);
      if (!current) return { ok: false, error: `Employee ${id} not found.` };
      if (updates.name !== undefined && !updates.name.trim()) {
        return { ok: false, error: "Name cannot be empty." };
      }
      if (updates.role !== undefined && !updates.role.trim()) {
        return { ok: false, error: "Role cannot be empty." };
      }
      if (updates.weeklyCapacityPoints !== undefined && updates.weeklyCapacityPoints < 0) {
        return { ok: false, error: "Capacity must be 0 or higher." };
      }
      setAllEmployees((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const nextName = updates.name?.trim() ?? e.name;
          const nameChanged = updates.name !== undefined && updates.name.trim() !== e.name;
          return {
            ...e,
            ...updates,
            name: nextName,
            role: updates.role?.trim() ?? e.role,
            description:
              updates.description !== undefined ? updates.description.trim() || undefined : e.description,
            avatarInitial:
              updates.avatarInitial?.trim()?.slice(0, 3).toUpperCase() ??
              (nameChanged ? deriveInitials(nextName) : e.avatarInitial),
          };
        })
      );
      return { ok: true };
    },
    []
  );

  const removeEmployee = useCallback(
    (id: string): MutationResult & { unassignedTaskCount?: number; removedFromProjects?: number } => {
      const current = employeesRef.current.find((e) => e.id === id);
      if (!current) return { ok: false, error: `Employee ${id} not found.` };
      const affectedTaskCount = tasksRef.current.filter((t) => t.assigneeId === id).length;
      const affectedProjectCount = new Set(
        membershipsRef.current.filter((m) => m.employeeId === id).map((m) => m.projectId)
      ).size;
      setAllTasks((prev) => prev.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t)));
      setAllMemberships((prev) => prev.filter((m) => m.employeeId !== id));
      setAllEmployees((prev) => prev.filter((e) => e.id !== id));
      return { ok: true, unassignedTaskCount: affectedTaskCount, removedFromProjects: affectedProjectCount };
    },
    []
  );

  // ─── Project membership ───
  const addMemberToActiveProject = useCallback(
    (employeeId: string): MutationResult => {
      const activeProject = projectIdRef.current;
      const employee = employeesRef.current.find((e) => e.id === employeeId);
      if (!employee) return { ok: false, error: `Employee ${employeeId} not found.` };
      const exists = membershipsRef.current.some(
        (m) => m.projectId === activeProject && m.employeeId === employeeId
      );
      if (exists) return { ok: false, error: "Already on this project." };
      setAllMemberships((prev) => [...prev, { projectId: activeProject, employeeId }]);
      return { ok: true };
    },
    []
  );

  const removeMemberFromActiveProject = useCallback(
    (employeeId: string): MutationResult & { unassignedTaskCount?: number } => {
      const activeProject = projectIdRef.current;
      const exists = membershipsRef.current.some(
        (m) => m.projectId === activeProject && m.employeeId === employeeId
      );
      if (!exists) return { ok: false, error: "Not on this project." };
      const affected = tasksRef.current.filter(
        (t) => t.assigneeId === employeeId && t.projectId === activeProject
      ).length;
      setAllTasks((prev) =>
        prev.map((t) =>
          t.assigneeId === employeeId && t.projectId === activeProject ? { ...t, assigneeId: null } : t
        )
      );
      setAllMemberships((prev) =>
        prev.filter((m) => !(m.projectId === activeProject && m.employeeId === employeeId))
      );
      return { ok: true, unassignedTaskCount: affected };
    },
    []
  );

  const toggleChat = useCallback(() => setIsChatOpen((v) => !v), []);

  const openChatWithQuery = useCallback((question: string) => {
    setIsChatOpen(true);
    setChatPrefillQuery(question);
  }, []);

  const clearChatPrefill = useCallback(() => setChatPrefillQuery(null), []);

  const chatMessages = chatByProject[selectedProjectId] ?? [];

  const setChatMessages = useCallback<SmartPMContextValue["setChatMessages"]>(
    (m) => {
      setChatByProject((prev) => {
        const currentForProject = prev[projectIdRef.current] ?? [];
        const next = typeof m === "function" ? m(currentForProject) : m;
        return { ...prev, [projectIdRef.current]: next };
      });
    },
    []
  );

  const value = useMemo<SmartPMContextValue>(
    () => ({
      today: TODAY,
      projects,
      selectedProjectId,
      selectedProject,
      setSelectedProjectId,
      employees: allEmployees,
      memberships: allMemberships,
      team: projectTeam,
      sprints: projectSprints,
      tasks: projectTasks,
      blockers: projectBlockers,
      goals: projectGoals,
      selectedSprintId,
      setSelectedSprintId,
      updateTaskStatus,
      updateTaskAssignee,
      moveTask,
      updateTaskTime,
      updateTaskSprint,
      updateTaskDescription,
      addTaskDependency,
      removeTaskDependency,
      addTask,
      updateTaskGoals,
      addEmployee,
      updateEmployee,
      removeEmployee,
      addMemberToActiveProject,
      removeMemberFromActiveProject,
      isChatOpen,
      toggleChat,
      chatMessages,
      setChatMessages,
      chatPrefillQuery,
      openChatWithQuery,
      clearChatPrefill,
    }),
    [
      projects,
      selectedProjectId,
      selectedProject,
      setSelectedProjectId,
      allEmployees,
      allMemberships,
      projectTeam,
      projectSprints,
      projectTasks,
      projectBlockers,
      projectGoals,
      selectedSprintId,
      setSelectedSprintId,
      isChatOpen,
      chatMessages,
      setChatMessages,
      chatPrefillQuery,
      openChatWithQuery,
      clearChatPrefill,
      updateTaskStatus,
      updateTaskAssignee,
      moveTask,
      updateTaskTime,
      updateTaskSprint,
      updateTaskDescription,
      addTaskDependency,
      removeTaskDependency,
      addTask,
      updateTaskGoals,
      addEmployee,
      updateEmployee,
      removeEmployee,
      addMemberToActiveProject,
      removeMemberFromActiveProject,
      toggleChat,
    ]
  );

  return <SmartPMContext.Provider value={value}>{children}</SmartPMContext.Provider>;
}

export function useSmartPM() {
  const ctx = useContext(SmartPMContext);
  if (!ctx) throw new Error("useSmartPM must be used inside SmartPMProvider");
  return ctx;
}
