"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STOCK_METADATA } from "@/lib/mockData";

interface StockHeaderProps {
  ticker: string;
}

export function StockHeader({ ticker }: StockHeaderProps) {
  const stock = STOCK_METADATA[ticker];

  if (!stock) return null;

  const isPositive = stock.return1Y.startsWith("+");

  return (
    <Card className="p-5 rounded-xl border-0 bg-[#1E293B] text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{stock.ticker}</h2>
            {stock.label && (
              <Badge className="bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 border-0">
                {stock.label}
              </Badge>
            )}
          </div>
          <p className="text-slate-400">{stock.name}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold">
              ₹{stock.currentPrice.toFixed(2)}
            </p>
            <Badge
              className={`mt-1 border-0 ${
                isPositive
                  ? "bg-[#1D9E75]/20 text-[#1D9E75]"
                  : "bg-[#E24B4A]/20 text-[#E24B4A]"
              }`}
            >
              {stock.return1Y} (1Y)
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-slate-400">Market Cap</p>
            <p className="font-semibold">{stock.marketCap}</p>
          </div>
          <div>
            <p className="text-slate-400">P/E Ratio</p>
            <p className="font-semibold">{stock.pe}</p>
          </div>
          <div>
            <p className="text-slate-400">Capacity</p>
            <p className="font-semibold">{stock.capacity}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
