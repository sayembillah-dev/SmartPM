"use client";

import { Plus, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddTeamMemberDialog({ open, onClose }: Props) {
  const { employees, team, addMemberToActiveProject } = useSmartPM();
  const [query, setQuery] = useState("");

  const teamIds = useMemo(() => new Set(team.map((m) => m.id)), [team]);

  const available = useMemo(() => {
    const list = employees.filter((e) => !teamIds.has(e.id));
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q)
    );
  }, [employees, teamIds, query]);

  function add(employeeId: string, name: string) {
    const res = addMemberToActiveProject(employeeId);
    if (!res.ok) {
      toast.error(res.error ?? "Could not add member.");
      return;
    }
    toast.success(`Added ${name} to project.`);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add team member</DialogTitle>
          <DialogDescription>
            Pick from the global employee pool. To create a new employee or edit details, head to{" "}
            <Link href="/resources" className="text-brand underline-offset-2 hover:underline">
              Resources
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or skill…"
            className="pl-8"
            autoFocus
          />
        </div>

        <div className="max-h-[55vh] overflow-y-auto -mx-1 px-1 space-y-1.5">
          {available.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              {employees.length === team.length
                ? "Everyone is already on this project."
                : "No employees match that search."}
            </div>
          ) : (
            available.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 rounded-md border border-border p-3 hover:border-brand/40 transition-colors"
              >
                <Avatar size="default">
                  <AvatarFallback className="bg-brand/10 text-brand font-semibold text-xs">
                    {e.avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{e.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{e.role}</span>
                  </div>
                  {e.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{e.description}</p>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {e.weeklyCapacityPoints} pts/week capacity
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 shrink-0"
                  onClick={() => add(e.id, e.name)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Create new employee
          </Link>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
