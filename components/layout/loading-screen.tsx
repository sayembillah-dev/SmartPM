"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const STAGES = [
  { label: "Loading projects…", duration: 550 },
  { label: "Loading employees…", duration: 700 },
  { label: "Loading sprints…", duration: 600 },
  { label: "Loading tasks…", duration: 900 },
  { label: "Wiring up AI assistant…", duration: 650 },
  { label: "Ready", duration: 250 },
] as const;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const total = STAGES.reduce((s, x) => s + x.duration, 0);
    let elapsed = 0;
    let rafId = 0;

    function advance(idx: number) {
      if (cancelled) return;
      if (idx >= STAGES.length) {
        setProgress(100);
        setTimeout(() => {
          if (!cancelled) onComplete();
        }, 220);
        return;
      }
      setStage(idx);
      const stageStart = elapsed;
      const stageDuration = STAGES[idx].duration;
      const startTs = performance.now();

      const tick = () => {
        if (cancelled) return;
        const t = Math.min(performance.now() - startTs, stageDuration);
        setProgress(((stageStart + t) / total) * 100);
        if (t < stageDuration) {
          rafId = requestAnimationFrame(tick);
        } else {
          elapsed += stageDuration;
          advance(idx + 1);
        }
      };
      rafId = requestAnimationFrame(tick);
    }

    advance(0);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-3 mb-7">
        <span className="w-12 h-12 rounded-2xl bg-brand text-white inline-flex items-center justify-center shadow-md shadow-brand/30">
          <Sparkles className="w-6 h-6" />
        </span>
        <span className="text-3xl font-semibold tracking-tight">SmartPM</span>
      </div>

      <p className="text-sm text-muted-foreground mb-8 max-w-sm text-center">
        Agentic sprint management — preparing your workspace for the first time.
      </p>

      <div className="w-80 max-w-[88vw]">
        <div className="h-2 bg-muted rounded-full overflow-hidden ring-1 ring-border">
          <div
            className="h-full bg-gradient-to-r from-brand to-brand/70 rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-muted-foreground transition-opacity">
            {STAGES[stage]?.label}
          </span>
          <span className="text-muted-foreground tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-12 max-w-sm text-center">
        Seeding demo projects, team profiles, sprints, blockers, and task estimates.
      </p>
    </div>
  );
}
