import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SHAPBarChart } from "@/components/features/shap-bar-chart";
import { SHAPPieChart } from "@/components/features/shap-pie-chart";
import { ModelComparison } from "@/components/features/model-comparison";
import { Info } from "lucide-react";

export default function FeaturesPage() {
  return (
    <AppShell title="Model Explainability — SHAP Analysis">
      <div className="space-y-6">
        {/* Top Explanation Card */}
        <Card className="p-5 rounded-xl border-0 bg-[#534AB7]/10 border-l-4 border-l-[#534AB7]">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 shrink-0 text-[#534AB7]" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Understanding SHAP Values
              </h3>
              <p className="text-sm text-muted-foreground">
                SHAP (SHapley Additive exPlanations) values quantify each
                feature&apos;s contribution to predictions. Climate features
                (amber) vs Financial features (purple) are compared to
                understand the model&apos;s decision-making process.
              </p>
            </div>
          </div>
        </Card>

        {/* Row 1: SHAP Charts */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SHAPBarChart />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <SHAPPieChart />
            <Card className="p-4 rounded-xl border-0 border-l-4 border-l-[#1D9E75]">
              <p className="text-sm font-medium text-foreground">
                Removing temperature features increases RMSE by 28.2%, proving
                climate data is essential for accurate predictions.
              </p>
            </Card>
          </div>
        </div>

        {/* Row 2: Model Comparison */}
        <ModelComparison />
      </div>
    </AppShell>
  );
}
