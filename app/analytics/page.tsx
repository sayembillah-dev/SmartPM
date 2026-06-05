import { Header } from "@/components/layout/header";
import { SprintSelector } from "@/components/board/sprint-selector";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <>
      <Header>
        <SprintSelector />
      </Header>
      <main className="flex-1 overflow-auto p-6 min-w-0">
        <AnalyticsDashboard />
      </main>
    </>
  );
}
