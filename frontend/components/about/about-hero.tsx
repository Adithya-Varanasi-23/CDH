"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AboutHero() {
  return (
    <Card className="p-6 rounded-xl border-0 bg-[#0F172A] text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold lg:text-3xl text-balance">
            Rising Temperature Effect on Indian Energy Stocks
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Climate Data-Driven Predictive Modeling for Power Sector Investment
            Analysis
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/30 border-0">
              Climate Data Hackathon 2026
            </Badge>
            <Badge className="bg-[#534AB7]/20 text-[#a5a0e0] hover:bg-[#534AB7]/30 border-0">
              Visakhapatnam
            </Badge>
            <Badge className="bg-[#EF9F27]/20 text-[#EF9F27] hover:bg-[#EF9F27]/30 border-0">
              Problem Statement 3
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg bg-[#1D9E75]/20 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#1D9E75]">91%</p>
            <p className="text-xs text-slate-400">Accuracy</p>
          </div>
          <div className="rounded-lg bg-[#534AB7]/20 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#a5a0e0]">0.94</p>
            <p className="text-xs text-slate-400">R² Score</p>
          </div>
          <div className="rounded-lg bg-[#0EA5E9]/20 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#0EA5E9]">5</p>
            <p className="text-xs text-slate-400">Stocks</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
