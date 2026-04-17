"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STOCK_METADATA } from "@/lib/mockData";
import {
  CalendarDays,
  Thermometer,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// BACKEND SWAP: Replace generateFuturePrediction() with await fetchFuturePrediction(ticker, date) from lib/api.ts
// Endpoint: POST http://localhost:8000/predict-future with { ticker, date }
// This should call the LSTM model to generate predictions based on projected climate data

interface FuturePredictionTabProps {
  ticker: string;
}

interface PredictionResult {
  date: string;
  predictedTemp: number;
  predictedTempMin: number;
  predictedStock: number;
  confidence: number;
  climateImpact: "high" | "medium" | "low";
  isHeatwave: boolean;
}

function generateFuturePrediction(
  ticker: string,
  dateStr: string
): PredictionResult {
  const stock = STOCK_METADATA[ticker];
  const date = new Date(dateStr);
  const today = new Date();
  const daysAhead = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get month to simulate seasonal temperature patterns
  const month = date.getMonth();

  // Base temperature by month (India climate pattern)
  const monthlyBaseTemp: Record<number, number> = {
    0: 25, // Jan
    1: 28, // Feb
    2: 32, // Mar
    3: 38, // Apr
    4: 42, // May (peak summer)
    5: 40, // Jun
    6: 35, // Jul (monsoon)
    7: 33, // Aug
    8: 34, // Sep
    9: 32, // Oct
    10: 28, // Nov
    11: 24, // Dec
  };

  const baseTemp = monthlyBaseTemp[month] || 32;
  const tempVariation = (Math.random() - 0.5) * 4;
  const predictedTemp = Math.round((baseTemp + tempVariation) * 10) / 10;
  const predictedTempMin =
    Math.round((predictedTemp - 10 - Math.random() * 3) * 10) / 10;
  const isHeatwave = predictedTemp >= 40;

  // Stock prediction based on current price, days ahead, and temperature impact
  const currentPrice = stock.currentPrice;
  const trendFactor = 1 + (Math.random() - 0.48) * 0.02 * Math.sqrt(daysAhead);
  const tempImpact = isHeatwave ? 1.015 : predictedTemp > 35 ? 1.008 : 1;
  const seasonalFactor = month >= 3 && month <= 5 ? 1.02 : 1; // Summer premium for energy stocks

  const predictedStock =
    Math.round(currentPrice * trendFactor * tempImpact * seasonalFactor * 100) /
    100;

  // Confidence decreases with days ahead
  const confidence = Math.max(
    60,
    Math.round(95 - daysAhead * 0.5 + (Math.random() - 0.5) * 5)
  );

  // Climate impact assessment
  let climateImpact: "high" | "medium" | "low" = "low";
  if (isHeatwave) climateImpact = "high";
  else if (predictedTemp > 35) climateImpact = "medium";

  return {
    date: dateStr,
    predictedTemp,
    predictedTempMin,
    predictedStock,
    confidence,
    climateImpact,
    isHeatwave,
  };
}

export function FuturePredictionTab({ ticker }: FuturePredictionTabProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const stock = STOCK_METADATA[ticker];

  const handlePredict = () => {
    setError("");
    setPrediction(null);

    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    const selected = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      setError("Please select a future date");
      return;
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);

    if (selected > maxDate) {
      setError("Predictions are limited to 90 days in the future");
      return;
    }

    const result = generateFuturePrediction(ticker, selectedDate);
    setPrediction(result);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      {/* Date Input Card */}
      <Card className="p-6 rounded-xl border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D9E75]/10">
            <CalendarDays className="h-5 w-5 text-[#1D9E75]" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Future Date Prediction
            </h3>
            <p className="text-sm text-muted-foreground">
              Get predicted temperature and stock price for a future date
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="prediction-date"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Select Future Date
            </label>
            <Input
              id="prediction-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="h-11 bg-background border-border"
            />
          </div>
          <Button
            onClick={handlePredict}
            className="h-11 gap-2 bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white"
          >
            <Sparkles className="h-4 w-4" />
            Generate Prediction
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          {/* Summary Banner */}
          <Card
            className={`p-5 rounded-xl border-0 ${
              prediction.isHeatwave
                ? "bg-gradient-to-r from-[#E24B4A]/10 to-[#EF9F27]/10"
                : "bg-gradient-to-r from-[#1D9E75]/10 to-[#534AB7]/10"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prediction for</p>
                <p className="text-lg font-bold text-foreground">
                  {new Date(prediction.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Confidence:
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    prediction.confidence >= 80
                      ? "bg-[#1D9E75]/20 text-[#1D9E75]"
                      : prediction.confidence >= 70
                        ? "bg-[#EF9F27]/20 text-[#EF9F27]"
                        : "bg-[#E24B4A]/20 text-[#E24B4A]"
                  }`}
                >
                  {prediction.confidence}%
                </span>
              </div>
            </div>
          </Card>

          {/* Prediction Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Temperature Prediction */}
            <Card className="p-5 rounded-xl border-0">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    prediction.isHeatwave
                      ? "bg-[#E24B4A]/10"
                      : "bg-[#EF9F27]/10"
                  }`}
                >
                  <Thermometer
                    className={`h-6 w-6 ${
                      prediction.isHeatwave
                        ? "text-[#E24B4A]"
                        : "text-[#EF9F27]"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Predicted Temperature
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {prediction.predictedTemp}°C
                    </span>
                    <span className="text-sm text-muted-foreground">max</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Min: {prediction.predictedTempMin}°C
                  </p>
                </div>
              </div>
              {prediction.isHeatwave && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#E24B4A]/10 p-3">
                  <AlertCircle className="h-4 w-4 text-[#E24B4A]" />
                  <span className="text-sm font-medium text-[#E24B4A]">
                    Heatwave conditions expected
                  </span>
                </div>
              )}
            </Card>

            {/* Stock Prediction */}
            <Card className="p-5 rounded-xl border-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D9E75]/10">
                  <TrendingUp className="h-6 w-6 text-[#1D9E75]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Predicted Stock Price
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      ₹{prediction.predictedStock.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="text-foreground">
                      ₹{stock.currentPrice.toFixed(2)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span
                      className={
                        prediction.predictedStock > stock.currentPrice
                          ? "text-[#1D9E75]"
                          : "text-[#E24B4A]"
                      }
                    >
                      {prediction.predictedStock > stock.currentPrice
                        ? "+"
                        : ""}
                      {(
                        ((prediction.predictedStock - stock.currentPrice) /
                          stock.currentPrice) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Climate Impact Assessment */}
          <Card className="p-5 rounded-xl border-0">
            <h4 className="mb-4 font-semibold text-foreground">
              Climate Impact Assessment
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Impact Level</p>
                <p
                  className={`mt-1 text-lg font-bold capitalize ${
                    prediction.climateImpact === "high"
                      ? "text-[#E24B4A]"
                      : prediction.climateImpact === "medium"
                        ? "text-[#EF9F27]"
                        : "text-[#1D9E75]"
                  }`}
                >
                  {prediction.climateImpact}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Energy Demand</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {prediction.isHeatwave
                    ? "Peak"
                    : prediction.predictedTemp > 35
                      ? "High"
                      : "Normal"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Market Outlook</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {prediction.predictedStock > stock.currentPrice
                    ? "Bullish"
                    : "Bearish"}
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground">
            Predictions are generated using LSTM model with IMD climate data.
            This is for educational purposes only and should not be used for
            actual investment decisions.
          </p>
        </div>
      )}
    </div>
  );
}
