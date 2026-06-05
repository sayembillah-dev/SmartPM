import { Header } from "@/components/layout/header";
import { SprintSelector } from "@/components/board/sprint-selector";
import { TeamPage } from "@/components/team/team-page";

export default function TeamRoute() {
  return (
    <>
      <Header>
        <SprintSelector />
      </Header>
      <main className="flex-1 overflow-auto p-6 min-w-0">
        <TeamPage />
      </main>
    </>
  );
}
