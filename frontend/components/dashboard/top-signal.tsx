"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

// BACKEND SWAP: Replace hardcoded values with latest prediction from fetchPredictions() from lib/api.ts
// Endpoint: GET http://localhost:8000/predictions/NTPC
// DB Table: predictions

export function TopSignal() {
  return (
    <Card className="p-5 rounded-xl border-0">
      <h3 className="mb-3 font-semibold text-foreground">
        {"Today's Top Signal"}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">NTPC</span>
          <Badge className="bg-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/30 border-0">
            <TrendingUp className="mr-1 h-3 w-3" />
            +0.59%
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Predicted</p>
            <p className="font-semibold text-[#534AB7]">₹383.20</p>
          </div>
          <div>
            <p className="text-muted-foreground">Actual</p>
            <p className="font-semibold">₹380.95</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
