"use client";

import { Info } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className }: Props) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setPos({
          top: rect.top + window.scrollY - 8,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
      }
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPos(null);
  };

  return (
    <div
      ref={iconRef}
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help hover:text-muted-foreground/80 transition-colors" />
      {pos &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
            }}
            className="w-64 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
          </div>,
          document.body
        )}
    </div>
  );
}
