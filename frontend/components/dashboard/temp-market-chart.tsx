"use client";

import { Card } from "@/components/ui/card";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts";
import { getMockClimate, getMockHistory, STOCK_TICKERS } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// BACKEND SWAP: Replace getMockClimate() and getMockHistory() with await fetchClimateData() and fetchHistory() from lib/api.ts
// Endpoint: GET http://localhost:8000/climate, GET http://localhost:8000/history/[ticker]
// DB Table: climate_data, stock_prices

interface DataPoint {
  date: string;
  temperature: number;
  volume: number;
  isHeatwave: boolean;
}

export function TempMarketChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatwaveRange, setHeatwaveRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  useEffect(() => {
    const climate = getMockClimate();

    // Average volume across all stocks
    const allVolumes = STOCK_TICKERS.map((ticker) => getMockHistory(ticker));

    const chartData: DataPoint[] = climate.map((c, i) => ({
      date: new Date(c.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      temperature: c.tMax,
      volume:
        allVolumes.reduce((sum, hist) => sum + (hist[i]?.volume || 0), 0) /
        allVolumes.length /
        1000000,
      isHeatwave: c.isHeatwave,
    }));

    // Find heatwave range
    let start = -1;
    let end = -1;
    chartData.forEach((d, i) => {
      if (d.isHeatwave) {
        if (start === -1) start = i;
        end = i;
      }
    });

    if (start !== -1) {
      setHeatwaveRange({ start, end });
    }

    setData(chartData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card className="p-5 rounded-xl border-0">
        <Skeleton className="h-[280px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">
        Temperature vs Market Correlation
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          {heatwaveRange && (
            <ReferenceArea
              x1={data[heatwaveRange.start]?.date}
              x2={data[heatwaveRange.end]?.date}
              fill="#EF9F27"
              fillOpacity={0.1}
              label={{
                value: "Heatwave Zone (T>37°C)",
                position: "insideTop",
                fill: "#EF9F27",
                fontSize: 11,
              }}
            />
          )}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}°C`}
            domain={[20, 50]}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => {
              if (name === "temperature") return [`${value.toFixed(1)}°C`, "Temperature"];
              return [`${value.toFixed(1)}M`, "Avg Volume"];
            }}
          />
          <Legend />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#0EA5E9"
            opacity={0.6}
            name="Avg Volume"
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            stroke="#EF9F27"
            strokeWidth={2}
            dot={false}
            name="Temperature"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
