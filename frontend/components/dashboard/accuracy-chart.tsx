"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { STOCK_METADATA, STOCK_TICKERS } from "@/lib/mockData";

// BACKEND SWAP: Replace STOCK_METADATA with data from fetchPredictions() from lib/api.ts
// Endpoint: GET http://localhost:8000/predictions/[ticker]
// DB Table: model_metrics

const data = STOCK_TICKERS.map((ticker) => ({
  name: ticker,
  accuracy: STOCK_METADATA[ticker].accuracy,
})).sort((a, b) => b.accuracy - a.accuracy);

const getColor = (accuracy: number) => {
  if (accuracy >= 92) return "#1D9E75";
  if (accuracy >= 90) return "#22C55E";
  if (accuracy >= 88) return "#84CC16";
  return "#EF9F27";
};

export function AccuracyChart() {
  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Model Accuracy by Stock
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis
            type="number"
            domain={[80, 100]}
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value}%`, "Accuracy"]}
          />
          <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.accuracy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
