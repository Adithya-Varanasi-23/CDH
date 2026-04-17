import { AppShell } from "@/components/layout/app-shell";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SuccessCriteria } from "@/components/dashboard/success-criteria";
import { StockPredictionsChart } from "@/components/dashboard/stock-predictions-chart";
import { AccuracyChart } from "@/components/dashboard/accuracy-chart";
import { TopSignal } from "@/components/dashboard/top-signal";
import { TempMarketChart } from "@/components/dashboard/temp-market-chart";
import { BusinessImpact } from "@/components/dashboard/business-impact";

export default function DashboardPage() {
  return (
    <AppShell title="Market Overview">
      <div className="space-y-6">
        {/* Row 1: KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Avg Model Accuracy"
            value="91.0%"
            subtitle="Across 5 energy stocks"
            trend="up"
            trendPositive
            dark
          />
          <KPICard
            title="RMSE vs ARIMA"
            value="-41.8%"
            subtitle="vs baseline model"
            trend="down"
            trendPositive
            dark
          />
          <KPICard
            title="Climate Feature Value"
            value="+28.2%"
            subtitle="RMSE gain from temp data"
            trend="up"
            trendPositive
            dark
          />
          <KPICard
            title="R² Score"
            value="0.94"
            subtitle="Variance explained"
            dark
          />
        </div>

        {/* Row 2: Success Criteria */}
        <SuccessCriteria />

        {/* Row 3: Charts */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <StockPredictionsChart />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <AccuracyChart />
            <TopSignal />
          </div>
        </div>

        {/* Row 4: Temperature Correlation */}
        <TempMarketChart />

        {/* Row 5: Business Impact */}
        <BusinessImpact />
      </div>
    </AppShell>
  );
}
