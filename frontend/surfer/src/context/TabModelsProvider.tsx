import { ChartState, LoadMetrics, TabModel } from "@_types/shared";
import { API } from "@apis/axios";
import { TabModelsContext } from "@context/TabModelsContext";
import { useScan } from "@hooks/useScan";
import generateDefaultField from "@utils/generateLoad";
import { ReactNode, useRef, useState } from "react";

export const TabModelsProvider = ({ children }: { children: ReactNode }) => {
  const [tabModels, setTabModels] = useState<TabModel[]>([]);
  const [activeTabModel, setActiveTabModel] = useState<string | null>(null);
  const intervalMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const { ApiScanByMethod } = useScan();

  const addTabModel = async (controller: string, method: string, url: string) => {
    const id = `${method}_${url}_${Date.now()}`;
    const raw = await ApiScanByMethod(method, url);

    const load = generateDefaultField();

    const defaultMetrics: LoadMetrics = {
      successCount: 0,
      failureCount: 0,
      averageResponseTimeMs: 0,
      isRunning: false,
      timestamp: new Date().toISOString(),
    };

    const now = Date.now();
    const duration = parseInt(load[2]?.value ?? "60"); // 기본 60초로 설정
    const count = Math.floor((duration * 1000) / 1000) + 1;
    // const labels = Array.from({ length: count }, (_, i) => new Date(now + i * 1000));
    const startTime = new Date(now);
    const endTime = new Date(now + (count - 1) * 1000);

    const defaultChartState: ChartState = {
      // labels,
      success: [],
      failure: [],
      responseTime: [],
      errorRate: [],
      startTime,
      endTime,
      initialized: true,
    };

    const newTabModel: TabModel = {
      id,
      controller,
      method,
      url,
      response: null,
      params: raw ?? null,
      trace: null,
      isLoading: false,
      config: null,
      loadConfig: load,
      metrics: defaultMetrics,
      chartState: defaultChartState,
      test: 0,
    };

    setTabModels((prev) => [...prev, newTabModel]);
    setActiveTabModel(id);
  };

  const removeTabModel = (id: any) => {
    setTabModels((prev) => {
      const curIdx = prev.findIndex((t) => t.id === id);
      const nextTabModels = prev?.filter((t) => t.id !== id);

      if (activeTabModel === id) {
        const nextActiveTabModel = nextTabModels[curIdx - 1] ?? nextTabModels[0] ?? null;
        setActiveTabModel(nextActiveTabModel?.id ?? null);
      }

      return nextTabModels;
    });
  };

  const updateTabModel = (id: string, updates: Partial<TabModel>) => {
    setTabModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updates,
            }
          : m
      )
    );
  };

  const fetchMetricsAndUpdateCharts = async (id: string) => {
    try {
      const response = await API.get("/load/metrics", {
        params: {
          testId: id,
        },
      });
      const data = response.data as {
        timestamp: string;
        successCount: number;
        failureCount: number;
        averageResponseTimeMs: number;
        isRunning: boolean;
      };

      setTabModels((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;

          const prevChart = m.chartState;
          const xTime = new Date(data.timestamp);
          const total = data.successCount + data.failureCount;
          const errorRate = total === 0 ? 0 : data.failureCount / total;

          return {
            ...m,
            metrics: { ...data },
            chartState: {
              ...prevChart,
              endTime: xTime,
              success: [...prevChart.success, { x: xTime, y: data.successCount }],
              failure: [...prevChart.failure, { x: xTime, y: data.failureCount }],
              responseTime: [
                ...prevChart.responseTime,
                { x: xTime, y: data.averageResponseTimeMs },
              ],
              errorRate: [...prevChart.errorRate, { x: xTime, y: errorRate }],
            },
          };
        })
      );

      if (data.isRunning === false) {
        stopLoadTest(id);
      }
    } catch (error) {
      alert(error);
    }
  };

  const startLoadTest = async (id: string) => {
    const model = tabModels.find((m) => m.id === id);
    if (!model) return;

    const fields = model.loadConfig;

    if (!fields) {
      return;
    }

    // Check if any field has an error before submitting
    if (fields.some((field) => !field.validate)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    const config = Object.fromEntries(fields.map((field) => [field.name, field.value]));

    let finalUrl = model.url;

    if (model.config?.pathVariables) {
      for (const [key, value] of Object.entries(model.config?.pathVariables)) {
        finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }

    if (model.config?.params && Object.keys(model.config?.params).length > 0) {
      const queryString = new URLSearchParams(model.config?.params).toString();
      finalUrl += finalUrl.includes("?") ? `&${queryString}` : `?${queryString}`;
    }

    const rawBody = model.config?.body;

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
      testId: model.id,
      method: model.method,
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
    updateTabModel(model.id, {
      chartState: {
        initialized: true,
        startTime,
        endTime: startTime,
        success: [],
        failure: [],
        responseTime: [],
        errorRate: [],
      },
      metrics: {
        ...model.metrics,
        isRunning: true,
      },
    });

    const prevInterval = intervalMapRef.current.get(id);
    if (prevInterval) clearInterval(prevInterval);

    //polling
    const interval = setInterval(() => fetchMetricsAndUpdateCharts(id), 1000);
    intervalMapRef.current.set(id, interval);
  };

  const stopLoadTest = (id: string) => {
    const model = tabModels.find((m) => m.id === id);

    if (!model) return;

    const intervalID = intervalMapRef.current.get(model.id);
    if (intervalID) {
      clearInterval(intervalID);
      intervalMapRef.current.delete(id);
      updateTabModel(id, {
        metrics: {
          ...model.metrics,
          isRunning: false,
        },
      });
    }
  };

  return (
    <TabModelsContext.Provider
      value={{
        tabModels,
        activeTabModel,
        setActiveTabModel,
        removeTabModel,
        addTabModel,
        updateTabModel,
        startLoadTest,
        stopLoadTest,
      }}
    >
      {children}
    </TabModelsContext.Provider>
  );
};
