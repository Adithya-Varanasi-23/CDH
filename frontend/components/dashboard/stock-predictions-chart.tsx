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
  Legend,
  ResponsiveContainer,
} from "recharts";
import { STOCK_TICKERS, getMockHistory, STOCK_METADATA } from "@/lib/mockData";
import { useEffect, useState } from "react";

// BACKEND SWAP: Replace getMockHistory() with await fetchHistory() from lib/api.ts
// Endpoint: GET http://localhost:8000/history/[ticker]
// DB Table: stock_prices

const COLORS: Record<string, string> = {
  NTPC: "#1D9E75",
  ADANIPOWER: "#534AB7",
  TATAPOWER: "#EF9F27",
  JSWENERGY: "#E24B4A",
  POWERGRID: "#0EA5E9",
};

interface NormalizedDataPoint {
  date: string;
  [key: string]: number | string;
}

export function StockPredictionsChart() {
  const [data, setData] = useState<NormalizedDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch and normalize data for all stocks
    const allData: Record<string, { date: string; actual: number }[]> = {};
    const basePrices: Record<string, number> = {};

    STOCK_TICKERS.forEach((ticker) => {
      const history = getMockHistory(ticker);
      allData[ticker] = history;
      basePrices[ticker] = history[0]?.actual || STOCK_METADATA[ticker].currentPrice;
    });

    // Normalize to 0-100 scale for comparison
    const normalized: NormalizedDataPoint[] = allData[STOCK_TICKERS[0]].map(
      (_, i) => {
        const point: NormalizedDataPoint = {
          date: new Date(allData[STOCK_TICKERS[0]][i].date).toLocaleDateString(
            "en-IN",
            { day: "2-digit", month: "short" }
          ),
        };

        STOCK_TICKERS.forEach((ticker) => {
          const value = allData[ticker][i]?.actual || 0;
          point[ticker] = Math.round(((value / basePrices[ticker]) * 100 - 100) * 100) / 100;
        });

        return point;
      }
    );

    setData(normalized);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card className="p-5 rounded-xl border-0">
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Stock Price Predictions — Last 60 Days (Normalized %)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
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
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
          />
          <Legend />
          {STOCK_TICKERS.map((ticker) => (
            <Line
              key={ticker}
              type="monotone"
              dataKey={ticker}
              stroke={COLORS[ticker]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
