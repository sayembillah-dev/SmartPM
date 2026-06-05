"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartPM } from "@/components/providers/smart-pm-provider";

const statusBadge: Record<string, string> = {
  active: "bg-risk-on-track/15 text-risk-on-track",
  closed: "bg-muted text-muted-foreground",
  future: "bg-brand/15 text-brand",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  closed: "Closed",
  future: "Future",
};

export function SprintSelector() {
  const { sprints, selectedSprintId, setSelectedSprintId } = useSmartPM();

  return (
    <Select value={selectedSprintId} onValueChange={(v) => v && setSelectedSprintId(v)}>
      <SelectTrigger className="w-72 h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sprints.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            <div className="flex items-center gap-2">
              <span>{s.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadge[s.status]}`}>
                {statusLabel[s.status]}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
