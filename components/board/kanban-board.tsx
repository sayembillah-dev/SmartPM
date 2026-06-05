"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { Column } from "@/components/board/column";
import { TaskDetailModal } from "@/components/board/task-detail-modal";
import { FilterBar, type BoardFilters } from "@/components/board/filter-bar";
import { detectBlockers, scoreRisk } from "@/lib/agent-utils";
import type { Status, Task } from "@/types";

const COLUMNS: { id: Status; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
];

const COLUMN_IDS = new Set<Status>(COLUMNS.map((c) => c.id));

export function KanbanBoard() {
  const { tasks, team, blockers, selectedSprintId, today, moveTask } = useSmartPM();
  const [filters, setFilters] = useState<BoardFilters>({ assigneeId: "all", priority: "all", risk: "all" });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const sprintTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === selectedSprintId),
    [tasks, selectedSprintId]
  );

  const blockedTaskIds = useMemo(() => {
    const seeded = new Set(blockers.filter((b) => !b.resolved).map((b) => b.taskId));
    const detected = detectBlockers(sprintTasks, today).map((b) => b.taskId);
    detected.forEach((id) => seeded.add(id));
    return seeded;
  }, [blockers, sprintTasks, today]);

  const filtered = useMemo(() => {
    return sprintTasks.filter((t) => {
      if (filters.assigneeId === "unassigned" && t.assigneeId !== null) return false;
      if (filters.assigneeId !== "all" && filters.assigneeId !== "unassigned" && t.assigneeId !== filters.assigneeId) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.risk !== "all") {
        const r = scoreRisk(t, today, tasks, team);
        if (r.level !== filters.risk) return false;
      }
      return true;
    });
  }, [sprintTasks, filters, today, tasks, team]);

  const tasksByColumn = useMemo(() => {
    const map: Record<Status, Task[]> = { backlog: [], todo: [], in_progress: [], in_review: [], done: [] };
    for (const t of filtered) map[t.status].push(t);
    return map;
  }, [filtered]);

  function onDragStart(e: DragStartEvent) {
    setActiveTaskId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveTaskId(null);
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let targetStatus: Status;
    let targetIndex: number;

    if (COLUMN_IDS.has(overId as Status)) {
      // Dropped on the column itself (typically empty column or below all cards).
      targetStatus = overId as Status;
      targetIndex = tasksByColumn[targetStatus].length;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
      const col = tasksByColumn[targetStatus];
      const overIndex = col.findIndex((t) => t.id === overId);
      if (overIndex === -1) return;
      targetIndex = overIndex;
    }

    moveTask(activeId, targetStatus, targetIndex);
  }

  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) ?? null : null;

  return (
    <>
      <div className="mb-3">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasksByColumn[col.id]}
              blockedTaskIds={blockedTaskIds}
              onTaskClick={(id) => setSelectedTaskId(id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="bg-card border-2 border-brand rounded-md p-3 shadow-lg w-72 opacity-90">
              <p className="text-sm font-medium">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  );
}
