"use client";

import { AlertTriangle, Check, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { RiskAssessment } from "@/types";

const config = {
  on_track: {
    label: "On Track",
    Icon: Check,
    className: "bg-risk-on-track/10 text-risk-on-track border-risk-on-track/30",
  },
  at_risk: {
    label: "At Risk",
    Icon: Clock,
    className: "bg-risk-at-risk/10 text-risk-at-risk border-risk-at-risk/30",
  },
  overdue: {
    label: "Overdue",
    Icon: AlertTriangle,
    className: "bg-risk-overdue/10 text-risk-overdue border-risk-overdue/30",
  },
} as const;

export function RiskBadge({ risk, compact = false }: { risk: RiskAssessment; compact?: boolean }) {
  const { label, Icon, className } = config[risk.level];
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border text-xs font-medium",
              compact ? "px-1.5 py-0.5" : "px-2 py-0.5",
              className
            )}
          />
        }
      >
        <Icon className="w-3 h-3" />
        {label}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {risk.rationale}
      </TooltipContent>
    </Tooltip>
  );
}
