import { ChartState, TimePoint } from "@_types/shared";
import { API } from "@apis/axios";
import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useRef } from "react";

export const useLoad = (id: string) => {
  const { tabModels, updateTabModel } = useTabModelsContext();

  const tab = tabModels.find((t) => t.id === id)!;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartStateRef = useRef<ChartState>(tab.chartState);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function onStartLoadTest(event?: React.FormEvent) {
    event?.preventDefault();

    const fields = tab.loadConfig;

    if (!fields) {
      return;
    }

    // Check if any field has an error before submitting
    if (fields.some((field) => !field.validate)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    const config = Object.fromEntries(
      fields.map((field) => [field.name, field.value])
    );

    let finalUrl = tab.url;

    if (tab.config?.pathVariables) {
      for (const [key, value] of Object.entries(tab.config?.pathVariables)) {
        finalUrl = finalUrl.replace(
          `{${key}}`,
          encodeURIComponent(String(value))
        );
      }
    }

    if (tab.config?.params && Object.keys(tab.config?.params).length > 0) {
      const queryString = new URLSearchParams(tab.config?.params).toString();
      finalUrl += finalUrl.includes("?")
        ? `&${queryString}`
        : `?${queryString}`;
    }

    const rawBody = tab.config?.body;

    let parsedBody: any = null;

    if (rawBody && rawBody.trim() !== "") {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (error) {
        console.error("Invalid JSON in body:", error);
        alert("Body에 유효하지 않은 JSON이 포함되어 있습니다.");
        return;
      }
    }

    const formData = {
      ...config,
      method: tab.method,
      url: finalUrl,
      body: parsedBody ?? `{"key":"value"}`,
    };

    //Axios
    try {
      const response = await API.post("/load/start", null, {
        params: formData,
      });

      if (response.status === 200) {
        console.log("Load test started successfully:", response.data);
      } else {
        console.error("Failed to start load test:", response.data);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred");
    }

    const startTime = new Date();
    updateTabModel(tab.id, {
      chartState: {
        initialized: true,
        startTime,
        endTime: startTime,
        success: [],
        failure: [],
        responseTime: [],
        errorRate: [],
      },
    });

    if (intervalRef.current) clearInterval(intervalRef.current);

    await fetchMetricsAndUpdateCharts();

    intervalRef.current = setInterval(fetchMetricsAndUpdateCharts, 1000);
  }

  async function fetchMetricsAndUpdateCharts() {
    try {
      const response = await API.get("/load/metrics");
      const data = response.data as {
        timestamp: string;
        successCount: number;
        failureCount: number;
        averageResponseTimeMs: number;
        isRunning: boolean;
      };

      const newMetrics = { ...data };

      //chartState
      const prev = chartStateRef.current;
      const xTime = new Date(data.timestamp);
      const total = data.successCount + data.failureCount;
      const errorRate = total === 0 ? 0 : data.failureCount / total;

      const newChartState = {
        ...prev,
        success: [
          ...prev.success,
          { x: xTime, y: data.successCount } as TimePoint,
        ],
        failure: [
          ...prev.failure,
          { x: xTime, y: data.failureCount } as TimePoint,
        ],
        responseTime: [
          ...prev.responseTime,
          { x: xTime, y: data.averageResponseTimeMs } as TimePoint,
        ],
        errorRate: [...prev.errorRate, { x: xTime, y: errorRate } as TimePoint],
      };

      const n = Math.random();
      console.log(n);

      chartStateRef.current = newChartState;

      // Update charts with the fetched metrics data
      updateTabModel(tab.id, { metrics: newMetrics });
      updateTabModel(tab.id, { chartState: newChartState });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  return {
    onStartLoadTest,
  };
};
