"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, Target } from "lucide-react";

const criteria = [
  {
    target: "Target >85% Accuracy",
    achieved: "Achieved 91.0%",
  },
  {
    target: "Target >20% RMSE Reduction",
    achieved: "Achieved 41.8%",
  },
  {
    target: "Significant Climate Impact",
    achieved: "+28.2% RMSE improvement",
  },
];

export function SuccessCriteria() {
  return (
    <Card className="p-5 rounded-xl border-0 bg-gradient-to-r from-[#1D9E75]/10 to-[#534AB7]/10">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-[#534AB7]" />
        <h3 className="font-semibold text-foreground">
          Hackathon Success Criteria
        </h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {criteria.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1D9E75]" />
            <div>
              <p className="text-xs text-muted-foreground">{item.target}</p>
              <p className="text-sm font-semibold text-[#1D9E75]">
                {item.achieved}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
