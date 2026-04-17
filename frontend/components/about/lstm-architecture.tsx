"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const layers = [
  { name: "Input", desc: "18 features, 60-day window", color: "#0EA5E9" },
  { name: "LSTM-1", desc: "100 units, return_seq=True", color: "#1D9E75" },
  { name: "Dropout", desc: "0.2", color: "#94A3B8" },
  { name: "LSTM-2", desc: "50 units", color: "#1D9E75" },
  { name: "Output", desc: "1 value, next-day price", color: "#534AB7" },
];

const config = [
  { key: "Optimizer", value: "Adam (lr=0.001)" },
  { key: "Loss Function", value: "Mean Squared Error" },
  { key: "Batch Size", value: "32" },
  { key: "Max Epochs", value: "100" },
  { key: "Early Stopping", value: "Patience = 15" },
  { key: "Data Split", value: "70% / 15% / 15%" },
];

export function LSTMArchitecture() {
  return (
    <Card className="p-5 rounded-xl border-0 h-full">
      <h3 className="mb-4 font-semibold text-foreground">LSTM Architecture</h3>

      {/* Layer Diagram */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center">
            <div
              className="rounded-lg px-3 py-2 text-center min-w-[100px]"
              style={{ backgroundColor: `${layer.color}20`, borderColor: layer.color, borderWidth: 1 }}
            >
              <p className="font-semibold text-sm" style={{ color: layer.color }}>
                {layer.name}
              </p>
              <p className="text-xs text-muted-foreground">{layer.desc}</p>
            </div>
            {i < layers.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Config Table */}
      <div className="mt-4 rounded-lg bg-muted p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Training Configuration
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {config.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-muted-foreground">{item.key}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Callout */}
      <div className="mt-4 rounded-lg bg-[#1D9E75]/10 p-3 border-l-4 border-l-[#1D9E75]">
        <p className="text-sm text-muted-foreground">
          LSTM achieves <span className="font-semibold text-foreground">41.8% lower RMSE</span> than
          ARIMA by capturing long-term seasonal dependencies that linear models
          cannot.
        </p>
      </div>
    </Card>
  );
}
