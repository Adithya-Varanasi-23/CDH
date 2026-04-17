"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STOCK_METADATA, STOCK_TICKERS } from "@/lib/mockData";

export function StocksTable() {
  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-4 font-semibold text-foreground">Target Stocks</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">P/E</TableHead>
              <TableHead className="text-right">1Y Return</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STOCK_TICKERS.map((ticker) => {
              const stock = STOCK_METADATA[ticker];
              const isPositive = stock.return1Y.startsWith("+");
              return (
                <TableRow key={ticker}>
                  <TableCell className="font-medium">{stock.name}</TableCell>
                  <TableCell>{stock.ticker}</TableCell>
                  <TableCell>{stock.marketCap}</TableCell>
                  <TableCell className="text-right">
                    ₹{stock.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{stock.pe}</TableCell>
                  <TableCell className="text-right">
                    <span className={isPositive ? "text-[#1D9E75]" : "text-[#E24B4A]"}>
                      {stock.return1Y}
                    </span>
                  </TableCell>
                  <TableCell>{stock.capacity}</TableCell>
                  <TableCell>
                    {stock.label && (
                      <Badge className="bg-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/30 border-0">
                        {stock.label}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
