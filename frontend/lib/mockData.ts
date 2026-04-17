// Mock data for GridCast
// This data simulates what the FastAPI backend will provide

export interface StockMetadata {
  ticker: string;
  name: string;
  marketCap: string;
  pe: number;
  return1Y: string;
  capacity: string;
  label: string;
  currentPrice: number;
  accuracy: number;
}

export interface StockDataPoint {
  date: string;
  actual: number;
  predicted: number;
  volume: number;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
}

export interface ClimateDataPoint {
  date: string;
  tMax: number;
  tMin: number;
  humidity: number;
  departure: number;
  isHeatwave: boolean;
}

export interface SHAPFeature {
  name: string;
  value: number;
  category: "climate" | "financial" | "other";
}

export const STOCK_METADATA: Record<string, StockMetadata> = {
  NTPC: {
    ticker: "NTPC",
    name: "NTPC Limited",
    marketCap: "₹3.64L Cr",
    pe: 13.76,
    return1Y: "+11.47%",
    capacity: "75+ GW",
    label: "Most Stable",
    currentPrice: 380.95,
    accuracy: 94.2,
  },
  ADANIPOWER: {
    ticker: "ADANIPOWER",
    name: "Adani Power Limited",
    marketCap: "₹2.89L Cr",
    pe: 23.43,
    return1Y: "+45.81%",
    capacity: "17.5 GW",
    label: "Top Gainer",
    currentPrice: 151.2,
    accuracy: 91.8,
  },
  TATAPOWER: {
    ticker: "TATAPOWER",
    name: "Tata Power Company",
    marketCap: "₹1.28L Cr",
    pe: 23.39,
    return1Y: "+8.65%",
    capacity: "14+ GW",
    label: "",
    currentPrice: 402.15,
    accuracy: 89.5,
  },
  JSWENERGY: {
    ticker: "JSWENERGY",
    name: "JSW Energy Limited",
    marketCap: "₹88K Cr",
    pe: 35,
    return1Y: "-9.92%",
    capacity: "7+ GW",
    label: "",
    currentPrice: 507.8,
    accuracy: 87.3,
  },
  POWERGRID: {
    ticker: "POWERGRID",
    name: "Power Grid Corporation",
    marketCap: "₹3.15L Cr",
    pe: 15.74,
    return1Y: "+5.2%",
    capacity: "1.75L km",
    label: "",
    currentPrice: 299.45,
    accuracy: 92.1,
  },
};

export const STOCK_TICKERS = Object.keys(STOCK_METADATA);

export const MODEL_METRICS = {
  rmse: 12.4,
  mae: 9.8,
  mape: 3.2,
  r2: 0.94,
};

// Generate 60 days of stock data with realistic patterns
function generateStockData(
  ticker: string,
  basePrice: number
): StockDataPoint[] {
  const data: StockDataPoint[] = [];
  const startDate = new Date("2026-02-01");

  let price = basePrice;
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Add some volatility with trend
    const volatility = (Math.random() - 0.5) * basePrice * 0.03;
    const trend = Math.sin(i / 10) * basePrice * 0.02;
    const heatwaveEffect = i >= 30 && i <= 50 ? basePrice * 0.015 : 0;

    price = Math.max(
      basePrice * 0.9,
      Math.min(basePrice * 1.1, price + volatility + trend + heatwaveEffect)
    );

    const predicted = price * (0.98 + Math.random() * 0.04);
    const volume = 5000000 + Math.random() * 10000000 + (i >= 30 && i <= 50 ? 5000000 : 0);

    data.push({
      date: date.toISOString().split("T")[0],
      actual: Math.round(price * 100) / 100,
      predicted: Math.round(predicted * 100) / 100,
      volume: Math.round(volume),
      rsi: 30 + Math.random() * 40 + (i >= 30 && i <= 50 ? 15 : 0),
      macd: (Math.random() - 0.5) * 5,
      signal: (Math.random() - 0.5) * 4,
      histogram: (Math.random() - 0.5) * 2,
    });
  }

  return data;
}

// Generate 60 days of climate data
function generateClimateData(): ClimateDataPoint[] {
  const data: ClimateDataPoint[] = [];
  const startDate = new Date("2026-02-01");

  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Temperature increases during summer months (day 30-50 simulates heatwave)
    const baseTMax = 28 + (i / 60) * 12;
    const heatwaveBoost = i >= 30 && i <= 50 ? 8 : 0;
    const dailyVariation = (Math.random() - 0.5) * 4;

    const tMax = Math.min(46, baseTMax + heatwaveBoost + dailyVariation);
    const tMin = tMax - 10 - Math.random() * 4;

    data.push({
      date: date.toISOString().split("T")[0],
      tMax: Math.round(tMax * 10) / 10,
      tMin: Math.round(tMin * 10) / 10,
      humidity: 40 + Math.random() * 30,
      departure: tMax - 35 + (Math.random() - 0.5) * 2,
      isHeatwave: tMax >= 37,
    });
  }

  return data;
}

// Cache generated data
const stockDataCache: Record<string, StockDataPoint[]> = {};
const climateDataCache: ClimateDataPoint[] = generateClimateData();

export function getMockHistory(ticker: string): StockDataPoint[] {
  if (!stockDataCache[ticker]) {
    const basePrice = STOCK_METADATA[ticker]?.currentPrice || 300;
    stockDataCache[ticker] = generateStockData(ticker, basePrice);
  }
  return stockDataCache[ticker];
}

export function getMockPredictions(ticker: string): {
  ticker: string;
  predictions: Array<{ date: string; predicted: number; actual: number }>;
  metrics: typeof MODEL_METRICS;
} {
  const history = getMockHistory(ticker);
  return {
    ticker,
    predictions: history.map((d) => ({
      date: d.date,
      predicted: d.predicted,
      actual: d.actual,
    })),
    metrics: MODEL_METRICS,
  };
}

export function getMockClimate(): ClimateDataPoint[] {
  return climateDataCache;
}

export function getMockSHAP(): SHAPFeature[] {
  return [
    { name: "T_MAX", value: 14.2, category: "climate" },
    { name: "RSI_14", value: 12.8, category: "financial" },
    { name: "LAG_RETURN_1", value: 11.5, category: "financial" },
    { name: "HEATWAVE_DAYS", value: 9.7, category: "climate" },
    { name: "T_MIN", value: 8.3, category: "climate" },
    { name: "VOLUME", value: 7.1, category: "financial" },
    { name: "MACD", value: 6.8, category: "financial" },
    { name: "HUMIDITY", value: 5.9, category: "climate" },
    { name: "MA_20", value: 5.4, category: "financial" },
    { name: "OTHERS", value: 18.3, category: "other" },
  ];
}

export function getMockCorrelationData(ticker: string) {
  const climate = getMockClimate();
  const stock = getMockHistory(ticker);

  return climate.map((c, i) => ({
    tMax: c.tMax,
    return: stock[i]
      ? ((stock[i].actual - (stock[i - 1]?.actual || stock[i].actual)) /
          (stock[i - 1]?.actual || stock[i].actual)) *
        100
      : 0,
    isHeatwave: c.isHeatwave,
  }));
}

export const HEATWAVE_MONTHS = [
  { month: "April", days: 12 },
  { month: "May", days: 25 },
  { month: "June", days: 22 },
  { month: "July", days: 14 },
];

export const TEMPERATURE_DEPARTURE = [
  { month: "Jan", departure: -2.1 },
  { month: "Feb", departure: -0.8 },
  { month: "Mar", departure: 1.5 },
  { month: "Apr", departure: 3.2 },
  { month: "May", departure: 4.8 },
  { month: "Jun", departure: 3.1 },
];

export const MODEL_COMPARISON = [
  { model: "LSTM Full Model", rmse: 12.4, color: "#1D9E75" },
  { model: "LSTM No Climate", rmse: 15.9, color: "#EF9F27" },
  { model: "ARIMA Baseline", rmse: 21.3, color: "#E24B4A" },
  { model: "Linear Regression", rmse: 24.7, color: "#991B1B" },
];
