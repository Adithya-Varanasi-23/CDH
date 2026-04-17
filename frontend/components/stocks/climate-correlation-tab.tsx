"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts";
import { getMockCorrelationData } from "@/lib/mockData";
import { useEffect, useState } from "react";

// BACKEND SWAP: Replace getMockCorrelationData() with combined data from fetchClimateData() and fetchHistory() from lib/api.ts
// Endpoint: GET http://localhost:8000/climate, GET http://localhost:8000/history/[ticker]
// DB Table: climate_data, stock_prices

interface ClimateCorrelationTabProps {
  ticker: string;
}

interface CorrelationPoint {
  tMax: number;
  return: number;
  isHeatwave: boolean;
}

export function ClimateCorrelationTab({ ticker }: ClimateCorrelationTabProps) {
  const [data, setData] = useState<{
    normal: CorrelationPoint[];
    heatwave: CorrelationPoint[];
  }>({ normal: [], heatwave: [] });
  const [loading, setLoading] = useState(true);
  const [correlation, setCorrelation] = useState(0);

  useEffect(() => {
    const rawData = getMockCorrelationData(ticker);

    const normal = rawData.filter((d) => !d.isHeatwave);
    const heatwave = rawData.filter((d) => d.isHeatwave);

    // Calculate simple correlation coefficient
    const n = rawData.length;
    const sumX = rawData.reduce((s, d) => s + d.tMax, 0);
    const sumY = rawData.reduce((s, d) => s + d.return, 0);
    const sumXY = rawData.reduce((s, d) => s + d.tMax * d.return, 0);
    const sumX2 = rawData.reduce((s, d) => s + d.tMax * d.tMax, 0);
    const sumY2 = rawData.reduce((s, d) => s + d.return * d.return, 0);

    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r = den === 0 ? 0 : num / den;

    setCorrelation(Math.round(r * 100) / 100);
    setData({ normal, heatwave });
    setLoading(false);
  }, [ticker]);

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 rounded-xl border-0">
        <h3 className="mb-4 font-semibold text-foreground">
          Temperature vs Stock Return Correlation
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              type="number"
              dataKey="tMax"
              name="Temperature"
              unit="°C"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
              label={{
                value: "Max Temperature (°C)",
                position: "bottom",
                offset: 0,
                fill: "#64748B",
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="return"
              name="Return"
              unit="%"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 1", "dataMax + 1"]}
              label={{
                value: "Daily Return (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#64748B",
                fontSize: 12,
              }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number, name: string) => {
                if (name === "Temperature") return [`${value.toFixed(1)}°C`, name];
                return [`${value.toFixed(2)}%`, "Return"];
              }}
            />
            <ReferenceLine y={0} stroke="#E2E8F0" strokeDasharray="3 3" />
            <ReferenceLine
              x={37}
              stroke="#E24B4A"
              strokeDasharray="3 3"
              label={{
                value: "Heatwave threshold",
                position: "top",
                fill: "#E24B4A",
                fontSize: 11,
              }}
            />
            <Scatter
              name="Normal Days"
              data={data.normal}
              fill="#0EA5E9"
              opacity={0.7}
            />
            <Scatter
              name="Heatwave Days"
              data={data.heatwave}
              fill="#E24B4A"
              opacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0EA5E9]"></span>
            <span className="text-muted-foreground">Normal Days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#E24B4A]"></span>
            <span className="text-muted-foreground">Heatwave Days (T &gt; 37°C)</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 rounded-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">Correlation Coefficient</h4>
            <p className="text-sm text-muted-foreground">
              Pearson correlation between max temperature and daily returns
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#534AB7]">{correlation}</p>
            <p className="text-sm text-muted-foreground">
              {Math.abs(correlation) > 0.5
                ? "Strong"
                : Math.abs(correlation) > 0.3
                ? "Moderate"
                : "Weak"}{" "}
              correlation
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
