import { Header } from "@/components/layout/header";
import { ResourcesPage } from "@/components/resources/resources-page";

export default function ResourcesRoute() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-auto p-6 min-w-0">
        <ResourcesPage />
      </main>
    </>
  );
}
