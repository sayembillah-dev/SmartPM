import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const styles: Record<Priority, string> = {
  critical: "bg-risk-overdue/10 text-risk-overdue border-risk-overdue/30",
  high: "bg-risk-at-risk/10 text-risk-at-risk border-risk-at-risk/30",
  medium: "bg-brand/10 text-brand border-brand/30",
  low: "bg-muted text-muted-foreground border-border",
};

const labels: Record<Priority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium",
        styles[priority]
      )}
    >
      {labels[priority]}
    </span>
  );
}
