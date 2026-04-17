"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";
import { getMockHistory } from "@/lib/mockData";
import { useEffect, useState } from "react";

// BACKEND SWAP: Replace getMockHistory() with await fetchHistory() from lib/api.ts
// Endpoint: GET http://localhost:8000/history/[ticker]
// DB Table: stock_prices

interface TechnicalIndicatorsTabProps {
  ticker: string;
}

interface ChartDataPoint {
  date: string;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
}

export function TechnicalIndicatorsTab({ ticker }: TechnicalIndicatorsTabProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const history = getMockHistory(ticker);

    const chartData: ChartDataPoint[] = history.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      rsi: d.rsi,
      macd: d.macd,
      signal: d.signal,
      histogram: d.histogram,
    }));

    setData(chartData);
    setLoading(false);
  }, [ticker]);

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6">
      {/* RSI Chart */}
      <Card className="p-5 rounded-xl border-0">
        <h3 className="mb-4 font-semibold text-foreground">RSI (14)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => [value.toFixed(1), "RSI"]}
            />
            <ReferenceLine
              y={70}
              stroke="#E24B4A"
              strokeDasharray="3 3"
              label={{
                value: "Overbought",
                position: "right",
                fill: "#E24B4A",
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={30}
              stroke="#1D9E75"
              strokeDasharray="3 3"
              label={{
                value: "Oversold",
                position: "right",
                fill: "#1D9E75",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#534AB7"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* MACD Chart */}
      <Card className="p-5 rounded-xl border-0">
        <h3 className="mb-4 font-semibold text-foreground">MACD</h3>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data}>
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
                  macd: "MACD",
                  signal: "Signal",
                  histogram: "Histogram",
                };
                return [value.toFixed(2), labels[name] || name];
              }}
            />
            <ReferenceLine y={0} stroke="#E2E8F0" />
            <Bar
              dataKey="histogram"
              fill="#0EA5E9"
              opacity={0.5}
              name="Histogram"
            />
            <Line
              type="monotone"
              dataKey="macd"
              stroke="#1D9E75"
              strokeWidth={2}
              dot={false}
              name="MACD"
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke="#EF9F27"
              strokeWidth={2}
              dot={false}
              name="Signal"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#1D9E75]"></span>
            <span className="text-muted-foreground">MACD Line</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#EF9F27]"></span>
            <span className="text-muted-foreground">Signal Line</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0EA5E9]"></span>
            <span className="text-muted-foreground">Histogram</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
