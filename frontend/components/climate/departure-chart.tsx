"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { TEMPERATURE_DEPARTURE } from "@/lib/mockData";

// BACKEND SWAP: Replace TEMPERATURE_DEPARTURE with aggregated data from fetchClimateData() from lib/api.ts
// Endpoint: GET http://localhost:8000/climate
// DB Table: climate_data

export function DepartureChart() {
  return (
    <Card className="p-5 rounded-xl border-0 h-full">
      <h3 className="mb-4 font-semibold text-foreground">
        Temperature Departure from Normal
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={TEMPERATURE_DEPARTURE}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}°C`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [
              `${value > 0 ? "+" : ""}${value}°C`,
              "Departure",
            ]}
          />
          <ReferenceLine y={0} stroke="#94A3B8" />
          <Bar dataKey="departure" radius={[4, 4, 0, 0]}>
            {TEMPERATURE_DEPARTURE.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.departure > 0 ? "#E24B4A" : "#0EA5E9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#E24B4A]"></span>
          <span className="text-muted-foreground">Above Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#0EA5E9]"></span>
          <span className="text-muted-foreground">Below Normal</span>
        </div>
      </div>
    </Card>
  );
}
