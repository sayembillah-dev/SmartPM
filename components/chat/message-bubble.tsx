"use client";

import ReactMarkdown from "react-markdown";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { SelectionTooltip } from "@/components/chat/selection-tooltip";

export function MessageBubble({
  message,
  userPrompt,
}: {
  message: ChatMessage;
  userPrompt?: string;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm",
          isUser ? "bg-brand text-white" : "bg-accent text-foreground"
        )}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap leading-relaxed">{message.content}</span>
        ) : (
          <SelectionTooltip aiResponse={message.content} userPrompt={userPrompt}>
            <div
              className={cn(
                "prose prose-sm max-w-none leading-relaxed",
                "prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0",
                "prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc",
                "prose-ol:my-2 prose-ol:pl-5",
                "prose-li:my-0.5 prose-li:marker:text-muted-foreground",
                "prose-strong:font-semibold prose-strong:text-foreground",
                "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none",
                "prose-headings:hidden"
              )}
            >
              <ReactMarkdown>{message.content || "…"}</ReactMarkdown>
            </div>
          </SelectionTooltip>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
