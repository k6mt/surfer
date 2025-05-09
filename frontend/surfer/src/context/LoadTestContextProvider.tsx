import { ReactNode, useState } from "react";
import { LoadTestContext } from "./LoadTestContext";

export interface LoadMetrics {
  successCount: number;
  failureCount: number;
  averageResponseTimeMs: number;
  isRunning: boolean;
}

export interface LoadTestConfig {
  duration: number;
}

export interface LoadTestContextProps {
  metrics: LoadMetrics;
  config: LoadTestConfig;
  setMetrics: (m: LoadMetrics) => void;
  setConfig: (m: LoadTestConfig) => void;
}

const defaultMetrics: LoadMetrics = {
  successCount: 0,
  failureCount: 0,
  averageResponseTimeMs: 0,
  isRunning: false,
};

const defaultConfig: LoadTestConfig = {
  duration: 60,
};

export function LoadTestProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<LoadMetrics>(defaultMetrics);
  const [config, setConfig] = useState<LoadTestConfig>(defaultConfig);

  return (
    <LoadTestContext.Provider
      value={{ metrics, setMetrics, config, setConfig }}
    >
      {children}
    </LoadTestContext.Provider>
  );
}
