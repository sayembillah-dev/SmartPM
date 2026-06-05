"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { TaskCard } from "@/components/board/task-card";
import { cn } from "@/lib/utils";
import type { Status, Task } from "@/types";

interface Props {
  id: Status;
  title: string;
  tasks: Task[];
  blockedTaskIds: Set<string>;
  onTaskClick: (taskId: string) => void;
}

export function Column({ id, title, tasks, blockedTaskIds, onTaskClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex flex-col bg-muted/40 rounded-lg border border-border min-h-[200px] w-72 shrink-0">
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
            {tasks.length}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{totalPoints} pts</span>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 p-2 space-y-2 transition-colors",
            isOver && "bg-brand/5"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-xs text-muted-foreground italic text-center py-6">
              No tasks
            </div>
          ) : (
            tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                hasBlocker={blockedTaskIds.has(t.id)}
                onClick={() => onTaskClick(t.id)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
