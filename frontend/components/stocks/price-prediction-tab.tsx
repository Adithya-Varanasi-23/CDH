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
  Line,
  ComposedChart,
} from "recharts";
import { getMockHistory, MODEL_METRICS } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

// BACKEND SWAP: Replace getMockHistory() with await fetchHistory() and fetchPredictions() from lib/api.ts
// Endpoint: GET http://localhost:8000/history/[ticker], GET http://localhost:8000/predictions/[ticker]
// DB Table: stock_prices, predictions

interface PricePredictionTabProps {
  ticker: string;
}

interface ChartDataPoint {
  date: string;
  actual: number;
  predicted: number;
  upperBand: number;
  lowerBand: number;
}

export function PricePredictionTab({ ticker }: PricePredictionTabProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const history = getMockHistory(ticker);

    const chartData: ChartDataPoint[] = history.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      actual: d.actual,
      predicted: d.predicted,
      upperBand: d.predicted * 1.02,
      lowerBand: d.predicted * 0.98,
    }));

    setData(chartData);
    setLoading(false);
  }, [ticker]);

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 rounded-xl border-0">
        <h3 className="mb-4 font-semibold text-foreground">
          Price Prediction — Actual vs Predicted
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#534AB7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#534AB7" stopOpacity={0.05} />
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
              tickFormatter={(v) => `₹${v}`}
              domain={["dataMin - 10", "dataMax + 10"]}
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
                  actual: "Actual",
                  predicted: "Predicted",
                };
                return [`₹${value.toFixed(2)}`, labels[name] || name];
              }}
            />
            <Area
              type="monotone"
              dataKey="upperBand"
              stroke="transparent"
              fill="url(#bandGradient)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="lowerBand"
              stroke="transparent"
              fill="#F8FAFC"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#1D9E75"
              strokeWidth={2}
              fill="url(#actualGradient)"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#534AB7"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Metrics Pills */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="p-4 rounded-xl border-0 text-center">
          <p className="text-sm text-muted-foreground">RMSE</p>
          <p className="text-xl font-bold text-foreground">{MODEL_METRICS.rmse}</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 text-center">
          <p className="text-sm text-muted-foreground">MAE</p>
          <p className="text-xl font-bold text-foreground">{MODEL_METRICS.mae}</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 text-center">
          <p className="text-sm text-muted-foreground">MAPE</p>
          <p className="text-xl font-bold text-foreground">{MODEL_METRICS.mape}%</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 text-center">
          <p className="text-sm text-muted-foreground">R²</p>
          <p className="text-xl font-bold text-foreground">{MODEL_METRICS.r2}</p>
        </Card>
      </div>

      {/* Insight Callouts */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Seasonal Patterns",
            desc: "Model captures summer demand cycles effectively",
          },
          {
            title: "Heatwave Periods",
            desc: "Higher predictability during heat events (+18% accuracy)",
          },
          {
            title: "Climate Contribution",
            desc: "Temperature features contribute 18–25% to predictions",
          },
        ].map((insight, i) => (
          <Card key={i} className="p-4 rounded-xl border-0 border-l-4 border-l-[#1D9E75]">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 shrink-0 text-[#1D9E75]" />
              <div>
                <p className="font-semibold text-foreground">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
