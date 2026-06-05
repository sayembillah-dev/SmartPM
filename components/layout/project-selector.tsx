"use client";

import { Check, ChevronDown, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { cn } from "@/lib/utils";

export function ProjectSelector() {
  const { projects, selectedProject, selectedProjectId, setSelectedProjectId } = useSmartPM();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 -ml-1 px-2 h-8 max-w-[260px]" />
        }
      >
        <span className="w-6 h-6 rounded-md bg-brand/10 text-brand inline-flex items-center justify-center shrink-0">
          <FolderKanban className="w-3.5 h-3.5" />
        </span>
        <span className="font-semibold truncate">{selectedProject.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
          Switch project
        </div>
        <DropdownMenuSeparator />
        {projects.map((p) => {
          const active = p.id === selectedProjectId;
          return (
            <DropdownMenuItem
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={cn("flex items-start gap-2 py-2", active && "bg-accent/60")}
            >
              <span className="w-7 h-7 rounded-md bg-brand/10 text-brand inline-flex items-center justify-center shrink-0 mt-0.5">
                <FolderKanban className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                {p.description && (
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {p.description}
                  </div>
                )}
              </div>
              {active && <Check className="w-4 h-4 text-brand shrink-0 mt-1" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
