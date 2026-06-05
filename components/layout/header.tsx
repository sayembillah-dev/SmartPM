"use client";

import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { ProjectSelector } from "@/components/layout/project-selector";

const titles: Record<string, string> = {
  "/": "Sprint Board",
  "/team": "Team",
  "/analytics": "Analytics",
  "/resources": "Resources",
};

export function Header({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { toggleChat, isChatOpen } = useSmartPM();
  const pageTitle = titles[pathname] ?? "SmartPM";

  return (
    <header className="h-14 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <ProjectSelector />
        <span className="text-muted-foreground/50">/</span>
        <span className="text-sm font-medium text-muted-foreground truncate">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        <Button
          variant={isChatOpen ? "default" : "outline"}
          size="sm"
          onClick={toggleChat}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>
      </div>
    </header>
  );
}
