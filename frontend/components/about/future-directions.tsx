"use client";

import { Card } from "@/components/ui/card";
import { Rocket, Cloud, Building2, Brain } from "lucide-react";

const directions = [
  {
    number: 1,
    title: "Real-Time Deployment",
    description: "Live API with daily predictions and auto-retraining",
    icon: Rocket,
    color: "#1D9E75",
  },
  {
    number: 2,
    title: "Extended Climate Variables",
    description: "Humidity, rainfall, wind speed, solar irradiance",
    icon: Cloud,
    color: "#0EA5E9",
  },
  {
    number: 3,
    title: "Sector Expansion",
    description: "Agri-chemicals, logistics, cooling appliance stocks",
    icon: Building2,
    color: "#EF9F27",
  },
  {
    number: 4,
    title: "Transformer Models",
    description: "Attention mechanisms for longer temporal sequences",
    icon: Brain,
    color: "#534AB7",
  },
];

export function FutureDirections() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Future Directions</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {directions.map((item) => (
          <Card key={item.number} className="p-5 rounded-xl border-0 relative">
            <div
              className="absolute -top-3 -left-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.number}
            </div>
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
