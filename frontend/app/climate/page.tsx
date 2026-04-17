import { AppShell } from "@/components/layout/app-shell";
import { ClimateKPIs } from "@/components/climate/climate-kpis";
import { TemperatureChart } from "@/components/climate/temperature-chart";
import { HeatwaveChart } from "@/components/climate/heatwave-chart";
import { DepartureChart } from "@/components/climate/departure-chart";
import { ClimateNexus } from "@/components/climate/climate-nexus";

export default function ClimatePage() {
  return (
    <AppShell title="IMD Temperature Intelligence">
      <div className="space-y-6">
        {/* Row 1: KPI Cards */}
        <ClimateKPIs />

        {/* Row 2: Main Temperature Chart */}
        <TemperatureChart />

        {/* Row 3: Two Column Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <HeatwaveChart />
          <DepartureChart />
        </div>

        {/* Row 4: Climate-Finance Nexus */}
        <ClimateNexus />
      </div>
    </AppShell>
  );
}
