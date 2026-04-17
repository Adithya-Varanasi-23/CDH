"use client";

import { Card } from "@/components/ui/card";
import { Zap, DollarSign, Flame, TrendingUp } from "lucide-react";

const drivers = [
  {
    title: "Higher PLFs",
    description: "Increased plant load factor boosts revenue",
    icon: Zap,
    color: "#1D9E75",
  },
  {
    title: "Merchant Tariffs",
    description: "Peak pricing improves profit margins",
    icon: DollarSign,
    color: "#534AB7",
  },
  {
    title: "Fuel Demand",
    description: "Coal and gas consumption rises with heat",
    icon: Flame,
    color: "#EF9F27",
  },
  {
    title: "Investor Sentiment",
    description: "Growth expectations drive valuations",
    icon: TrendingUp,
    color: "#0EA5E9",
  },
];

export function ClimateNexus() {
  return (
    <Card className="p-5 rounded-xl border-0 bg-[#1E293B]">
      <h3 className="mb-4 font-semibold text-white">
        Climate-Finance Nexus: Stock Price Drivers
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {drivers.map((driver, i) => (
          <div
            key={i}
            className="rounded-lg bg-white/5 p-4 border border-white/10"
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${driver.color}30` }}
            >
              <driver.icon className="h-5 w-5" style={{ color: driver.color }} />
            </div>
            <h4 className="font-semibold text-white">{driver.title}</h4>
            <p className="text-sm text-slate-400">{driver.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
