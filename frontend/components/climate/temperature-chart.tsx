"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getMockClimate } from "@/lib/mockData";
import { useEffect, useState } from "react";

// BACKEND SWAP: Replace getMockClimate() with await fetchClimateData() from lib/api.ts
// Endpoint: GET http://localhost:8000/climate
// DB Table: climate_data

interface ChartDataPoint {
  date: string;
  tMax: number;
  tMin: number;
  departure: number;
}

export function TemperatureChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const climate = getMockClimate();

    const chartData: ChartDataPoint[] = climate.map((c) => ({
      date: new Date(c.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      tMax: c.tMax,
      tMin: c.tMin,
      departure: c.departure,
    }));

    setData(chartData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card className="p-5 rounded-xl border-0">
        <Skeleton className="h-[350px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Daily Temperature Range — Last 60 Days
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tMaxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF9F27" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF9F27" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="tMinGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}°C`}
            domain={[15, 50]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                tMax: "Max Temp",
                tMin: "Min Temp",
              };
              return [`${value.toFixed(1)}°C`, labels[name] || name];
            }}
          />
          <ReferenceLine
            y={37}
            stroke="#E24B4A"
            strokeDasharray="5 5"
            label={{
              value: "Heatwave threshold (37°C)",
              position: "insideTopRight",
              fill: "#E24B4A",
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="tMax"
            stroke="#EF9F27"
            strokeWidth={2}
            fill="url(#tMaxGradient)"
            name="tMax"
          />
          <Area
            type="monotone"
            dataKey="tMin"
            stroke="#0EA5E9"
            strokeWidth={2}
            fill="url(#tMinGradient)"
            name="tMin"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#EF9F27]"></span>
          <span className="text-muted-foreground">Max Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#0EA5E9]"></span>
          <span className="text-muted-foreground">Min Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-6 bg-[#E24B4A]" style={{ borderTop: "2px dashed #E24B4A" }}></span>
          <span className="text-muted-foreground">Heatwave Threshold</span>
        </div>
      </div>
    </Card>
  );
}
