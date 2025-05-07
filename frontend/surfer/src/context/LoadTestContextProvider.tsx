import { ReactNode, useState } from "react";
import { LoadTestContext } from "./LoadTestContext";

export interface LoadMetrics {
  successCount: number;
  failureCount: number;
  averageResponseTimeMs: number;
  errorRate: number;
  isRunning: boolean;
}

export interface LoadTestContextProps {
  metrics: LoadMetrics;
  setMetrics: (m: LoadMetrics) => void;
}

const defaultMetrics: LoadMetrics = {
  successCount: 0,
  failureCount: 0,
  averageResponseTimeMs: 0,
  errorRate: 0,
  isRunning: false,
};

export function LoadTestProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<LoadMetrics>(defaultMetrics);

  return (
    <LoadTestContext.Provider value={{ metrics, setMetrics }}>
      {children}
    </LoadTestContext.Provider>
  );
}
