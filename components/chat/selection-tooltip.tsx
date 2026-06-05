"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "explain" | "define";

interface SelectionCoords {
  x: number;
  y: number;
  text: string;
}

interface ResultState {
  mode: Mode;
  content: string;
  loading: boolean;
}

export function SelectionTooltip({
  children,
  aiResponse,
  userPrompt = "",
}: {
  children: React.ReactNode;
  aiResponse: string;
  userPrompt?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isLockedRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const [coords, setCoords] = useState<SelectionCoords | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const dismiss = useCallback(() => {
    setCoords(null);
    setResult(null);
    isLockedRef.current = false;
  }, []);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        if (!isLockedRef.current) {
          setCoords(null);
          setResult(null);
        }
        return;
      }
      const range = sel.getRangeAt(0);
      if (!containerRef.current?.contains(range.commonAncestorContainer)) {
        if (!isLockedRef.current) {
          setCoords(null);
          setResult(null);
        }
        return;
      }
      const text = sel.toString().trim();
      if (!text) return;
      const rect = range.getBoundingClientRect();
      setCoords({ x: rect.left + rect.width / 2, y: rect.top, text });
      setResult(null);
      isLockedRef.current = false;
    },
    []
  );

  const handleSelectionChange = useCallback(() => {
    if (isLockedRef.current || isMouseDownRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setCoords(null);
      setResult(null);
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      isMouseDownRef.current = true;
      if (!isLockedRef.current) return;
      if (tooltipRef.current?.contains(e.target as Node)) return;
      dismiss();
    },
    [dismiss]
  );

  const handleGlobalMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleGlobalMouseUp, true);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleGlobalMouseUp, true);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleMouseUp, handleMouseDown, handleGlobalMouseUp, handleSelectionChange]);

  useEffect(() => {
    if (!coords) return;
    const onScroll = (e: Event) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;
      dismiss();
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [coords, dismiss]);

  async function fetchResult(mode: Mode) {
    if (!coords) return;
    isLockedRef.current = true;
    setResult({ mode, content: "", loading: true });
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText: coords.text,
          aiResponse,
          userPrompt,
          mode,
        }),
      });
      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error((errBody as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let content = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as { type: string; delta?: string };
            if (event.type === "text" && event.delta) {
              content += event.delta;
              setResult({ mode, content, loading: true });
            } else if (event.type === "done") {
              setResult({ mode, content, loading: false });
            }
          } catch {}
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setResult({ mode, content: msg, loading: false });
    }
  }

  const show = !!coords;

  return (
    <div ref={containerRef}>
      {children}
      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <TooltipPopover
            tooltipRef={tooltipRef}
            coords={coords}
            result={result}
            onExplain={() => fetchResult("explain")}
            onDefine={() => fetchResult("define")}
            onDismiss={dismiss}
          />,
          document.body
        )}
    </div>
  );
}

function TooltipPopover({
  tooltipRef,
  coords,
  result,
  onExplain,
  onDefine,
  onDismiss,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  coords: SelectionCoords;
  result: ResultState | null;
  onExplain: () => void;
  onDefine: () => void;
  onDismiss: () => void;
}) {
  const GAP = 8;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1024;
  const x = Math.max(80, Math.min(coords.x, viewportW - 80));

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${coords.y - GAP}px`,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
      }}
      className="pointer-events-auto"
    >
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-xl shadow-black/10",
          "overflow-hidden transition-all duration-150",
          result ? "w-72" : "w-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>

          {!result ? (
            <>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onExplain}
                className="text-xs font-medium text-foreground hover:text-brand transition-colors whitespace-nowrap"
              >
                Explain
              </button>
              <span className="text-muted-foreground/40 text-xs select-none">·</span>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onDefine}
                className="text-xs font-medium text-foreground hover:text-brand transition-colors whitespace-nowrap"
              >
                Definition
              </button>
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-foreground flex-1">
                {result.mode === "explain" ? "Explanation" : "Definition"}
              </span>
              {!result.loading && (
                <button
                  onClick={onDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-1 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Result body */}
        {result && (
          <>
            <div className="h-px bg-border" />
            <div className="px-3 py-2.5 text-xs text-foreground/90 leading-relaxed max-h-48 overflow-y-auto">
              {!result.content && result.loading ? (
                <span className="text-muted-foreground animate-pulse">
                  {result.mode === "explain" ? "Explaining…" : "Defining…"}
                </span>
              ) : (
                <>
                  <span className="whitespace-pre-wrap">{result.content}</span>
                  {result.loading && (
                    <span className="inline-block w-0.5 h-3 bg-brand ml-0.5 animate-pulse align-middle" />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
