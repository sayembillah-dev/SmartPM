"use client";

import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/board/kanban-board";
import { SprintSelector } from "@/components/board/sprint-selector";
import { SummaryModal } from "@/components/board/summary-modal";
import { CreateTaskDialog } from "@/components/board/create-task-dialog";

export default function SprintBoardPage() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <Header>
        <SprintSelector />
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New task
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSummaryOpen(true)} className="gap-2">
          <FileText className="w-4 h-4" />
          Generate Summary
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-6 min-w-0">
        <KanbanBoard />
      </main>
      <SummaryModal open={summaryOpen} onClose={() => setSummaryOpen(false)} />
      <CreateTaskDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
