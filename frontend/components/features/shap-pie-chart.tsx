"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// BACKEND SWAP: Calculate from fetchSHAP() response from lib/api.ts
// Endpoint: GET http://localhost:8000/features/importance
// DB Table: feature_importance

const data = [
  { name: "Climate", value: 38.1, color: "#EF9F27" },
  { name: "Financial", value: 44.2, color: "#534AB7" },
  { name: "Other", value: 17.7, color: "#94A3B8" },
];

export function SHAPPieChart() {
  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Climate vs Financial Split
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value}%`, "Contribution"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
