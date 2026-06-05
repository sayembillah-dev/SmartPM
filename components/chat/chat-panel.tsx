"use client";

import { Sparkles, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { ChatThread } from "@/components/chat/chat-thread";

export function ChatPanel() {
  const { isChatOpen, toggleChat, chatMessages, setChatMessages } = useSmartPM();

  return (
    <Sheet open={isChatOpen} onOpenChange={(open) => !open && toggleChat()}>
      <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col gap-0">
        <SheetHeader className="border-b border-border px-5 py-4 pr-20">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-brand" />
            AI Assistant
          </SheetTitle>
          <SheetDescription>Ask about sprints, blockers, workload, or risks.</SheetDescription>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-12"
            onClick={() => setChatMessages([])}
            disabled={chatMessages.length === 0}
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </SheetHeader>
        <ChatThread />
      </SheetContent>
    </Sheet>
  );
}
