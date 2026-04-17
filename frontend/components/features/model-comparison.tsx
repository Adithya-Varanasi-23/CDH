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
import { MODEL_COMPARISON } from "@/lib/mockData";
import { Lightbulb } from "lucide-react";

// BACKEND SWAP: Replace MODEL_COMPARISON with data from backend ablation study
// Endpoint: GET http://localhost:8000/models/comparison
// DB Table: model_metrics

export function ModelComparison() {
  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Ablation Study — Model Comparison (RMSE)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={MODEL_COMPARISON} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="model"
            tick={{ fontSize: 11, fill: "#64748B", textAnchor: "end" }}
            tickLine={false}
            angle={-20}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            domain={[0, 30]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [value, "RMSE"]}
          />
          <Bar dataKey="rmse" radius={[4, 4, 0, 0]}>
            {MODEL_COMPARISON.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Insight Callouts */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Climate Data is Critical",
            desc: "Removing temp features +28.2% RMSE",
          },
          {
            title: "LSTM Outperforms Traditional",
            desc: "41.8% lower RMSE vs ARIMA",
          },
          {
            title: "Feature Synergy",
            desc: "Combined features beat individual groups",
          },
        ].map((insight, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-muted p-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-[#1D9E75]" />
            <div>
              <p className="font-semibold text-foreground text-sm">{insight.title}</p>
              <p className="text-xs text-muted-foreground">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
