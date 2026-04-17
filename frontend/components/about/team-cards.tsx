"use client";

import { Card } from "@/components/ui/card";

const team = [
  {
    initials: "KM",
    name: "K.J.S.S. Manohar",
    role: "AI & Data Engineer",
    color: "#1D9E75",
    responsibilities: [
      "Data pipeline architecture",
      "API development",
      "System integration",
    ],
  },
  {
    initials: "VA",
    name: "V.V.S. Aditya",
    role: "ML Engineer & Model Architect",
    color: "#534AB7",
    responsibilities: [
      "LSTM model design",
      "Hyperparameter tuning",
      "Model evaluation",
    ],
  },
  {
    initials: "PS",
    name: "P. Sasank",
    role: "Financial Analyst & Domain Expert",
    color: "#EF9F27",
    responsibilities: [
      "Stock market analysis",
      "Feature selection",
      "Business insights",
    ],
  },
  {
    initials: "MP",
    name: "M. Purandish",
    role: "Climate Researcher & Data Scientist",
    color: "#0EA5E9",
    responsibilities: [
      "IMD data processing",
      "Climate feature engineering",
      "Statistical analysis",
    ],
  },
];

export function TeamCards() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Team</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, i) => (
          <Card key={i} className="p-5 rounded-xl border-0">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {member.responsibilities.map((resp, j) => (
                <li
                  key={j}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: member.color }}
                  ></span>
                  {resp}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
