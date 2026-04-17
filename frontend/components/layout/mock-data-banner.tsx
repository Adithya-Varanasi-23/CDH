"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { fetchHealth } from "@/lib/api";

export function MockDataBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      const health = await fetchHealth();
      // Show banner if backend returns mock status
      if (health.status === "mock" || !health.models_loaded) {
        setShowBanner(true);
      }
    };

    checkBackend();
  }, []);

  if (!showBanner || dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>
          Running on mock data — start your backend at localhost:8000 to see
          live predictions
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="rounded p-1 hover:bg-amber-600/20 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
