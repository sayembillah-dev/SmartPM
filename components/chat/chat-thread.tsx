"use client";

import { BookOpen, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ToolCallCard } from "@/components/chat/tool-call-card";
import { PromptBook } from "@/components/chat/prompt-book";
import type { ChatMessage, Priority, Status, ToolCallProposal, ToolCallStatus } from "@/types";
import type { SprintContext } from "@/lib/prompts";

type CurrentPage = SprintContext["currentPage"];

function pageFromPathname(pathname: string): CurrentPage {
  if (pathname === "/" || pathname.startsWith("/board")) return "board";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/team")) return "team";
  if (pathname.startsWith("/resources")) return "resources";
  return undefined;
}

const SUGGESTIONS = [
  "Who has the highest workload right now?",
  "Which tasks are most likely to miss the deadline?",
  "Summarize this sprint's progress.",
  "What are the current blockers and how should I address them?",
];

type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "tool_call"; call: ToolCallProposal }
  | { type: "done" }
  | { type: "error"; message: string };

export function ChatThread() {
  const pathname = usePathname();
  const currentPage = pageFromPathname(pathname);

  const {
    selectedProject,
    tasks,
    sprints,
    team,
    blockers,
    selectedSprintId,
    goals,
    chatMessages,
    setChatMessages,
    updateTaskStatus,
    updateTaskAssignee,
    updateTaskSprint,
    addTaskDependency,
    removeTaskDependency,
    addTask,
    updateTaskGoals,
    chatPrefillQuery,
    clearChatPrefill,
  } = useSmartPM();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromptBook, setShowPromptBook] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(chatMessages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!chatPrefillQuery) return;
    setInput(chatPrefillQuery);
    clearChatPrefill();
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [chatPrefillQuery, clearChatPrefill]);

  useEffect(() => {
    messagesRef.current = chatMessages;
  }, [chatMessages]);

  async function streamTurn(messagesToSend: ChatMessage[], assistantId: string) {
    setPending(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend,
          context: { project: selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId, currentPage },
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errBody.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: StreamEvent;
          try {
            event = JSON.parse(trimmed) as StreamEvent;
          } catch {
            continue;
          }
          handleEvent(event, assistantId);
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `_Failed to fetch a response: ${msg}_` } : m
        )
      );
    } finally {
      setPending(false);
    }
  }

  function handleEvent(event: StreamEvent, assistantId: string) {
    if (event.type === "text") {
      setChatMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.delta } : m))
      );
    } else if (event.type === "tool_call") {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, toolCalls: [...(m.toolCalls ?? []), event.call] }
            : m
        )
      );
    } else if (event.type === "error") {
      setError(event.message);
    }
  }

  async function send(prompt?: string) {
    const userText = (prompt ?? input).trim();
    if (!userText || pending) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: userText };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "" };

    const messagesToSend = [...messagesRef.current, userMsg];
    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");

    await streamTurn(messagesToSend, assistantId);
  }

  function applyTool(call: ToolCallProposal): { status: ToolCallStatus; result: string } {
    try {
      const taskId = call.args.taskId as string;
      if (call.name === "update_task_status") {
        updateTaskStatus(taskId, call.args.status as Status);
      } else if (call.name === "reassign_task") {
        updateTaskAssignee(taskId, call.args.memberId as string);
      } else if (call.name === "unassign_task") {
        updateTaskAssignee(taskId, null);
      } else if (call.name === "add_task_dependency") {
        const result = addTaskDependency(taskId, call.args.dependsOnTaskId as string);
        if (!result.ok) {
          return {
            status: "failed",
            result: JSON.stringify({ status: "error", message: result.error }),
          };
        }
      } else if (call.name === "remove_task_dependency") {
        const result = removeTaskDependency(taskId, call.args.dependsOnTaskId as string);
        if (!result.ok) {
          return {
            status: "failed",
            result: JSON.stringify({ status: "error", message: result.error }),
          };
        }
      } else if (call.name === "move_task_to_sprint") {
        const result = updateTaskSprint(taskId, call.args.sprintId as string);
        if (!result.ok) {
          return {
            status: "failed",
            result: JSON.stringify({ status: "error", message: result.error }),
          };
        }
      } else if (call.name === "set_task_goals") {
        const ids = Array.isArray(call.args.goalIds) ? (call.args.goalIds as string[]) : [];
        const result = updateTaskGoals(taskId, ids);
        if (!result.ok) {
          return {
            status: "failed",
            result: JSON.stringify({ status: "error", message: result.error }),
          };
        }
      } else if (call.name === "create_task") {
        const a = call.args;
        const result = addTask({
          title: String(a.title ?? ""),
          description: typeof a.description === "string" ? a.description : undefined,
          status: a.status as Status | undefined,
          assigneeId: typeof a.assigneeId === "string" && a.assigneeId ? (a.assigneeId as string) : null,
          priority: a.priority as Priority,
          storyPoints: a.storyPoints as 1 | 2 | 3 | 5 | 8,
          dueDate: String(a.dueDate ?? ""),
          sprintId: String(a.sprintId ?? ""),
          estimatedHours: typeof a.estimatedHours === "number" ? a.estimatedHours : undefined,
          dependsOn: Array.isArray(a.dependsOn) ? (a.dependsOn as string[]) : undefined,
        });
        if (!result.ok) {
          return {
            status: "failed",
            result: JSON.stringify({ status: "error", message: result.error }),
          };
        }
        return {
          status: "confirmed",
          result: JSON.stringify({ status: "success", taskId: result.id }),
        };
      }
      return { status: "confirmed", result: JSON.stringify({ status: "success" }) };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to apply.";
      return { status: "failed", result: JSON.stringify({ status: "error", message }) };
    }
  }

  function resolveToolCall(messageId: string, callId: string, action: "confirm" | "cancel") {
    const currentMsg = messagesRef.current.find((m) => m.id === messageId);
    const call = currentMsg?.toolCalls?.find((tc) => tc.id === callId);
    if (!call || call.status !== "pending" || pending) return;

    let status: ToolCallStatus;
    let result: string;
    if (action === "cancel") {
      status = "cancelled";
      result = JSON.stringify({ status: "cancelled", message: "User declined to apply this change." });
    } else {
      const applied = applyTool(call);
      status = applied.status;
      result = applied.result;
    }

    const updatedMessages = messagesRef.current.map((m) => {
      if (m.id !== messageId || !m.toolCalls) return m;
      return {
        ...m,
        toolCalls: m.toolCalls.map((tc) => (tc.id === callId ? { ...tc, status, result } : tc)),
      };
    });

    const msg = updatedMessages.find((m) => m.id === messageId);
    const allResolved = msg?.toolCalls?.every((tc) => tc.status !== "pending");

    if (allResolved) {
      const nextAssistantId = `a-${Date.now()}`;
      const nextAssistantMsg: ChatMessage = { id: nextAssistantId, role: "assistant", content: "" };
      setChatMessages([...updatedMessages, nextAssistantMsg]);
      streamTurn(updatedMessages, nextAssistantId);
    } else {
      setChatMessages(updatedMessages);
    }
  }

  function editToolCall(messageId: string, callId: string) {
    const currentMsg = messagesRef.current.find((m) => m.id === messageId);
    const call = currentMsg?.toolCalls?.find((tc) => tc.id === callId);
    if (!call || call.status !== "pending" || call.name !== "create_task" || pending) return;

    const title = (call.args.title as string | undefined) ?? "the proposed task";
    const supersededResult = JSON.stringify({
      status: "superseded",
      message: "User chose to edit this proposal. Ask one short, specific question about what to change, then emit a fresh create_task with the revised args.",
    });

    const updatedMessages = messagesRef.current.map((m) => {
      if (m.id !== messageId || !m.toolCalls) return m;
      return {
        ...m,
        toolCalls: m.toolCalls.map((tc) =>
          tc.id === callId ? { ...tc, status: "superseded" as ToolCallStatus, result: supersededResult } : tc
        ),
      };
    });

    const editMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: `Let's edit the proposed task "${title}" before creating it.`,
    };
    const nextAssistantId = `a-${Date.now() + 1}`;
    const nextAssistantMsg: ChatMessage = { id: nextAssistantId, role: "assistant", content: "" };

    const withEdit = [...updatedMessages, editMsg];
    setChatMessages([...withEdit, nextAssistantMsg]);
    streamTurn(withEdit, nextAssistantId);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ScrollArea className="flex-1 min-h-0 px-5 py-4">
        {chatMessages.length === 0 ? (
          showPromptBook ? (
            <PromptBook
              onSelect={(text) => send(text)}
              onClose={() => setShowPromptBook(false)}
              disabled={pending}
            />
          ) : (
            <div className="space-y-4 mt-2">
              <div className="text-sm text-muted-foreground">
                Ask anything about the current sprint. The assistant has full context of your tasks, team, and blockers.
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm px-3 py-2 rounded-md border border-border hover:border-brand hover:bg-accent/40 transition-colors"
                    disabled={pending}
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-2 text-brand" />
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setShowPromptBook(true)}
                  className="text-left text-sm px-3 py-2 rounded-md border border-dashed border-border hover:border-brand hover:bg-accent/40 transition-colors text-muted-foreground"
                  disabled={pending}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-2" />
                  More prompts…
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {chatMessages.map((m, index) => {
              const userPrompt =
                m.role === "assistant"
                  ? chatMessages
                      .slice(0, index)
                      .reverse()
                      .find((msg) => msg.role === "user")?.content
                  : undefined;
              return (
              <div key={m.id} className="space-y-2">
                {(m.content || m.role === "user" || !m.toolCalls?.length) && (
                  <MessageBubble message={m} userPrompt={userPrompt} />
                )}
                {m.toolCalls?.map((tc) => (
                  <ToolCallCard
                    key={tc.id}
                    call={tc}
                    onConfirm={() => resolveToolCall(m.id, tc.id, "confirm")}
                    onCancel={() => resolveToolCall(m.id, tc.id, "cancel")}
                    onEdit={() => editToolCall(m.id, tc.id)}
                  />
                ))}
              </div>
            );
            })}
          </div>
        )}
      </ScrollArea>
      <div className="border-t border-border p-3 space-y-2">
        {error && <div className="text-xs text-destructive px-1">{error}</div>}
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask about the sprint…"
            rows={2}
            disabled={pending}
            className="resize-none"
          />
          <Button onClick={() => send()} disabled={pending || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
