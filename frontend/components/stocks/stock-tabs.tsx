"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricePredictionTab } from "./price-prediction-tab";
import { ClimateCorrelationTab } from "./climate-correlation-tab";
import { TechnicalIndicatorsTab } from "./technical-indicators-tab";
import { FuturePredictionTab } from "./future-prediction-tab";

interface StockTabsProps {
  ticker: string;
}

export function StockTabs({ ticker }: StockTabsProps) {
  return (
    <Tabs defaultValue="prediction" className="w-full">
      <TabsList className="mb-6 w-full justify-start bg-card rounded-xl p-1 h-auto flex-wrap">
        <TabsTrigger
          value="prediction"
          className="rounded-lg px-4 py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white"
        >
          Price Prediction
        </TabsTrigger>
        <TabsTrigger
          value="future"
          className="rounded-lg px-4 py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white"
        >
          Future Forecast
        </TabsTrigger>
        <TabsTrigger
          value="correlation"
          className="rounded-lg px-4 py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white"
        >
          Climate Correlation
        </TabsTrigger>
        <TabsTrigger
          value="technical"
          className="rounded-lg px-4 py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white"
        >
          Technical Indicators
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prediction">
        <PricePredictionTab ticker={ticker} />
      </TabsContent>

      <TabsContent value="future">
        <FuturePredictionTab ticker={ticker} />
      </TabsContent>

      <TabsContent value="correlation">
        <ClimateCorrelationTab ticker={ticker} />
      </TabsContent>

      <TabsContent value="technical">
        <TechnicalIndicatorsTab ticker={ticker} />
      </TabsContent>
    </Tabs>
  );
}
