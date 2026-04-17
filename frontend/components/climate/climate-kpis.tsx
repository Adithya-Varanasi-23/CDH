"use client";

import { Card } from "@/components/ui/card";
import { Thermometer, Flame, Sun, Zap, Gauge } from "lucide-react";

const kpis = [
  {
    title: "Peak Temperature",
    value: "44°C",
    icon: Thermometer,
    color: "#EF9F27",
  },
  {
    title: "Heatwave Days ≥37°C",
    value: "73 days",
    icon: Flame,
    color: "#E24B4A",
  },
  {
    title: "Days ≥40°C",
    value: "50 days",
    icon: Sun,
    color: "#E24B4A",
  },
  {
    title: "Peak Demand Impact",
    value: "+7 GW/°C",
    icon: Zap,
    color: "#534AB7",
  },
  {
    title: "Grid Utilisation",
    value: "95%",
    icon: Gauge,
    color: "#EF9F27",
  },
];

export function ClimateKPIs() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, i) => (
        <Card key={i} className="p-4 rounded-xl border-0">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${kpi.color}20` }}
            >
              <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{kpi.title}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
