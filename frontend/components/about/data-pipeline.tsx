"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, TrendingUp, ArrowDown, Cog, Brain } from "lucide-react";

export function DataPipeline() {
  return (
    <Card className="p-5 rounded-xl border-0 h-full">
      <h3 className="mb-4 font-semibold text-foreground">Data Pipeline</h3>

      <div className="space-y-4">
        {/* Data Sources */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-[#EF9F27]/10 p-3 border border-[#EF9F27]/20">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-4 w-4 text-[#EF9F27]" />
              <span className="font-medium text-sm">IMD API</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Max/Min Temperature</li>
              <li>Heatwave Days, Humidity</li>
              <li>350+ stations, 5+ years</li>
            </ul>
          </div>
          <div className="rounded-lg bg-[#0EA5E9]/10 p-3 border border-[#0EA5E9]/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#0EA5E9]" />
              <span className="font-medium text-sm">NSE API</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>OHLCV Data</li>
              <li>5 Energy Stocks</li>
              <li>5+ years daily data</li>
            </ul>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Processing Steps */}
        <div className="space-y-2">
          {[
            "Data Alignment — match trading days with temperature records",
            "Normalization — scale features to common range",
            "Validation — check data quality and completeness",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Cog className="h-4 w-4 shrink-0" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Feature Engineering */}
        <div className="rounded-lg bg-[#534AB7]/10 p-3 border border-[#534AB7]/20 text-center">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-4 w-4 text-[#534AB7]" />
            <span className="font-medium text-sm">Feature Engineering (18 features) → LSTM Model</span>
          </div>
        </div>

        {/* MLOps badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="text-xs">99.5% Uptime</Badge>
          <Badge variant="outline" className="text-xs">{"<5 min Runtime"}</Badge>
          <Badge variant="outline" className="text-xs">Reproducible</Badge>
          <Badge variant="outline" className="text-xs">Auto-Monitored</Badge>
        </div>
      </div>
    </Card>
  );
}
