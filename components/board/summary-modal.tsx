"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSmartPM } from "@/components/providers/smart-pm-provider";
import { SummaryReport } from "@/components/board/summary-report";
import { toast } from "sonner";
import type { SummaryReport as SummaryReportType } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SummaryModal({ open, onClose }: Props) {
  const { selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId } = useSmartPM();
  const [report, setReport] = useState<SummaryReportType | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputsRef = useRef({ selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId });
  useEffect(() => {
    inputsRef.current = { selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId };
  });

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    setReport(null);
    setError(null);
    setPending(true);

    (async () => {
      try {
        const { selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId } = inputsRef.current;
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: { project: selectedProject, tasks, sprints, team, blockers, goals, selectedSprintId },
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }
        const text = await res.text();
        if (controller.signal.aborted) return;
        const parsed = JSON.parse(text) as SummaryReportType;
        setReport(parsed);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    })();

    return () => controller.abort();
  }, [open]);

  async function copy() {
    if (!report) return;
    try {
      const text = renderReportAsText(report);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Summary copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-6xl w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            Sprint Summary
          </DialogTitle>
          <DialogDescription>AI-generated report for the selected sprint.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] -mx-1 px-1">
          {error ? (
            <div className="text-sm text-destructive p-3 rounded-md border border-destructive/30 bg-destructive/5">
              {error}
            </div>
          ) : pending || !report ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <SummaryReport report={report} />
          )}
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={copy} disabled={!report || pending} variant="outline" size="sm" className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderReportAsText(r: SummaryReportType): string {
  const lines: string[] = [];
  lines.push(`Verdict: ${r.verdict.level.toUpperCase()} — ${r.verdict.headline}`);
  lines.push("");
  lines.push(`Points: ${r.kpis.pointsDone}/${r.kpis.pointsPlanned}  |  Done: ${r.kpis.completedTasks}  |  Blockers: ${r.kpis.blockersCount}  |  At risk: ${r.kpis.riskCount}`);
  if (r.recommendations.length) {
    lines.push("");
    lines.push("Recommended actions:");
    r.recommendations.forEach((rec, i) => {
      lines.push(`  ${i + 1}. ${rec.action}${rec.reason ? ` — ${rec.reason}` : ""}`);
    });
  }
  if (r.blockers.length) {
    lines.push("");
    lines.push("Blockers:");
    r.blockers.forEach((b) => lines.push(`  • ${b.blockerId}: ${b.suggestedAction}`));
  }
  if (r.risks.length) {
    lines.push("");
    lines.push("Top risks:");
    r.risks.forEach((rk) => lines.push(`  • ${rk.taskId}: ${rk.rationale}`));
  }
  return lines.join("\n");
}
