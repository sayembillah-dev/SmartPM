import { cn } from "@/lib/utils";
import type { TaskType } from "@/types";

const styles: Record<TaskType, string> = {
  bug: "bg-risk-overdue/10 text-risk-overdue border-risk-overdue/30",
  feature: "bg-brand/10 text-brand border-brand/30",
  chore: "bg-muted text-muted-foreground border-border",
  spike: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

const labels: Record<TaskType, string> = {
  bug: "Bug",
  feature: "Feature",
  chore: "Chore",
  spike: "Spike",
};

export function TypeBadge({ type }: { type: TaskType | undefined }) {
  if (!type) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium",
        styles[type]
      )}
    >
      {labels[type]}
    </span>
  );
}
