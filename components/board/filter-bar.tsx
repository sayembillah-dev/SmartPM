"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import type { Priority, RiskLevel } from "@/types";

export interface BoardFilters {
  assigneeId: string | "all" | "unassigned";
  priority: Priority | "all";
  risk: RiskLevel | "all";
}

interface Props {
  filters: BoardFilters;
  setFilters: (f: BoardFilters) => void;
}

export function FilterBar({ filters, setFilters }: Props) {
  const { team } = useSmartPM();
  const hasActive = filters.assigneeId !== "all" || filters.priority !== "all" || filters.risk !== "all";

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <Field label="Assignee">
        <Select value={filters.assigneeId} onValueChange={(v) => v && setFilters({ ...filters, assigneeId: v as BoardFilters["assigneeId"] })}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {team.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Priority">
        <Select value={filters.priority} onValueChange={(v) => v && setFilters({ ...filters, priority: v as BoardFilters["priority"] })}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Risk">
        <Select value={filters.risk} onValueChange={(v) => v && setFilters({ ...filters, risk: v as BoardFilters["risk"] })}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All risks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risks</SelectItem>
            <SelectItem value="on_track">On Track</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({ assigneeId: "all", priority: "all", risk: "all" })}
          className="h-9 gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
