"use client";

import { BarChart3, FolderKanban, KanbanSquare, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Sprint Board", icon: KanbanSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: FolderKanban },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar text-sidebar-foreground shrink-0">
      <div className="h-14 flex items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-md bg-brand text-white flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-semibold tracking-tight">SmartPM</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground px-3 py-2">
          Demo build — dummy data
        </div>
      </div>
    </aside>
  );
}
