import { AppShell } from "@/components/layout/app-shell";
import { StockHeader } from "@/components/stocks/stock-header";
import { StockTabs } from "@/components/stocks/stock-tabs";
import { STOCK_TICKERS, STOCK_METADATA } from "@/lib/mockData";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return STOCK_TICKERS.map((ticker) => ({
    ticker,
  }));
}

interface StockPageProps {
  params: Promise<{ ticker: string }>;
}

export default async function StockPage({ params }: StockPageProps) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  if (!STOCK_TICKERS.includes(upperTicker)) {
    notFound();
  }

  const stock = STOCK_METADATA[upperTicker];

  return (
    <AppShell title={`${stock.name} (${stock.ticker})`}>
      <div className="space-y-6">
        <StockHeader ticker={upperTicker} />
        <StockTabs ticker={upperTicker} />
      </div>
    </AppShell>
  );
}
