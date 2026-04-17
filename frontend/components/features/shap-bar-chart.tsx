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
import { getMockSHAP } from "@/lib/mockData";

// BACKEND SWAP: Replace getMockSHAP() with await fetchSHAP() from lib/api.ts
// Endpoint: GET http://localhost:8000/features/importance
// DB Table: feature_importance

const data = getMockSHAP().sort((a, b) => b.value - a.value);

const getColor = (category: string) => {
  switch (category) {
    case "climate":
      return "#EF9F27";
    case "financial":
      return "#534AB7";
    default:
      return "#94A3B8";
  }
};

export function SHAPBarChart() {
  return (
    <Card className="p-5 rounded-xl border-0 h-full">
      <h3 className="mb-4 font-semibold text-foreground">
        Feature Importance Ranking
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string, props: { payload: { category: string } }) => [
              `${value}%`,
              props.payload.category === "climate"
                ? "Climate Feature"
                : props.payload.category === "financial"
                ? "Financial Feature"
                : "Other",
            ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#EF9F27]"></span>
          <span className="text-muted-foreground">Climate Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#534AB7]"></span>
          <span className="text-muted-foreground">Financial Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#94A3B8]"></span>
          <span className="text-muted-foreground">Other</span>
        </div>
      </div>
    </Card>
  );
}
