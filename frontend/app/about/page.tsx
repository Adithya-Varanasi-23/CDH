import { AppShell } from "@/components/layout/app-shell";
import { AboutHero } from "@/components/about/about-hero";
import { DataPipeline } from "@/components/about/data-pipeline";
import { LSTMArchitecture } from "@/components/about/lstm-architecture";
import { StocksTable } from "@/components/about/stocks-table";
import { FutureDirections } from "@/components/about/future-directions";
import { TeamCards } from "@/components/about/team-cards";

export default function AboutPage() {
  return (
    <AppShell title="About This Project">
      <div className="space-y-6">
        {/* Hero */}
        <AboutHero />

        {/* Row 1: Pipeline and Architecture */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DataPipeline />
          <LSTMArchitecture />
        </div>

        {/* Row 2: Stocks Table */}
        <StocksTable />

        {/* Row 3: Future Directions */}
        <FutureDirections />

        {/* Row 4: Team */}
        <TeamCards />
      </div>
    </AppShell>
  );
}
