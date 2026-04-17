import {
  getMockHistory,
  getMockPredictions,
  getMockClimate,
  getMockSHAP,
  type StockDataPoint,
  type ClimateDataPoint,
  type SHAPFeature,
} from "./mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// TODO: When backend is ready, each function below will call the real API.
// Mock data is the fallback — remove mock return and uncomment fetch when backend runs.

export async function fetchHealth(): Promise<{
  status: string;
  models_loaded: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("Backend not available");
    return res.json();
  } catch {
    // Return mock status when backend is unavailable
    return { status: "mock", models_loaded: false };
  }
}

export async function fetchHistory(ticker: string): Promise<StockDataPoint[]> {
  // TODO: uncomment when backend ready
  // const res = await fetch(`${API_BASE}/history/${ticker}`);
  // if (!res.ok) throw new Error('Failed to fetch history');
  // return res.json();
  return getMockHistory(ticker); // mock
}

export async function fetchPredictions(ticker: string): Promise<{
  ticker: string;
  predictions: Array<{ date: string; predicted: number; actual: number }>;
  metrics: { rmse: number; mae: number; mape: number; r2: number };
}> {
  // TODO: uncomment when backend ready
  // const res = await fetch(`${API_BASE}/predictions/${ticker}`);
  // if (!res.ok) throw new Error('Failed to fetch predictions');
  // return res.json();
  return getMockPredictions(ticker); // mock
}

export async function fetchClimateData(): Promise<ClimateDataPoint[]> {
  // TODO: uncomment when backend ready
  // const res = await fetch(`${API_BASE}/climate`);
  // if (!res.ok) throw new Error('Failed to fetch climate data');
  // return res.json();
  return getMockClimate(); // mock
}

export async function fetchSHAP(): Promise<SHAPFeature[]> {
  // TODO: uncomment when backend ready
  // const res = await fetch(`${API_BASE}/features/importance`);
  // if (!res.ok) throw new Error('Failed to fetch SHAP values');
  // return res.json();
  return getMockSHAP(); // mock
}
