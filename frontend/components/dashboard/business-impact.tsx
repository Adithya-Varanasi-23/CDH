"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Landmark, Zap } from "lucide-react";

const impacts = [
  {
    title: "Investment Decision Support",
    description:
      "Enable data-driven trading strategies based on climate forecasts",
    icon: TrendingUp,
    color: "#1D9E75",
  },
  {
    title: "Risk Management",
    description: "Quantify climate-related financial risks in energy portfolios",
    icon: Shield,
    color: "#534AB7",
  },
  {
    title: "Policy Insights",
    description: "Inform grid planning and capacity expansion decisions",
    icon: Landmark,
    color: "#EF9F27",
  },
  {
    title: "Market Efficiency",
    description:
      "Identify arbitrage opportunities from climate-driven demand shocks",
    icon: Zap,
    color: "#0EA5E9",
  },
];

export function BusinessImpact() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Why This Matters</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {impacts.map((item, i) => (
          <Card key={i} className="p-5 rounded-xl border-0">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <item.icon className="h-5 w-5" style={{ color: item.color }} />
            </div>
            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
