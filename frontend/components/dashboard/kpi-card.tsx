"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: "up" | "down";
  trendPositive?: boolean;
  sparkline?: number[];
  dark?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  dark = false,
}: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trendPositive ? "text-[#1D9E75]" : "text-[#E24B4A]";

  return (
    <Card
      className={cn(
        "p-5 rounded-xl border-0",
        dark ? "bg-[#1E293B] text-white" : "bg-white"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              dark ? "text-slate-400" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p
            className={cn(
              "text-xs",
              dark ? "text-slate-500" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        </div>
        {trend && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              trendPositive ? "bg-[#1D9E75]/20" : "bg-[#E24B4A]/20"
            )}
          >
            <TrendIcon className={cn("h-4 w-4", trendColor)} />
          </div>
        )}
      </div>
    </Card>
  );
}
