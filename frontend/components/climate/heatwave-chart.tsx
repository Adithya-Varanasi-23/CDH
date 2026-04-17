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
} from "recharts";
import { HEATWAVE_MONTHS } from "@/lib/mockData";

// BACKEND SWAP: Replace HEATWAVE_MONTHS with aggregated data from fetchClimateData() from lib/api.ts
// Endpoint: GET http://localhost:8000/climate
// DB Table: climate_data

const getColor = (days: number) => {
  if (days >= 25) return "#E24B4A";
  if (days >= 20) return "#EF9F27";
  if (days >= 15) return "#F59E0B";
  return "#FBBF24";
};

export function HeatwaveChart() {
  return (
    <Card className="p-5 rounded-xl border-0 h-full">
      <h3 className="mb-4 font-semibold text-foreground">
        Heatwave Days by Month
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={HEATWAVE_MONTHS}>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value} days`, "Heatwave Days"]}
          />
          <Bar dataKey="days" radius={[4, 4, 0, 0]}>
            {HEATWAVE_MONTHS.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.days)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
