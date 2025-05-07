import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  TimeSeriesScale,
} from "chart.js";
import { useEffect, useState } from "react";
import ChartBox from "@components/loadtest/LoadMetricsChartBox";
import { defaultOptions, getChartData } from "@utils/charts/chartConfig";
import { useLoadTestContext } from "@hooks/useLoadTestContext";

ChartJS.register(
  LineElement,
  CategoryScale,
  TimeSeriesScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);
const LoadMetricsChart = () => {
  const { metrics } = useLoadTestContext();

  const [labels, setLabels] = useState<string[]>([]);
  const [success, setSuccess] = useState<number[]>([]);
  const [failure, setFailure] = useState<number[]>([]);
  const [responseTime, setResponseTime] = useState<number[]>([]);
  const [errorRate, setErrorRate] = useState<number[]>([]);

  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    setLabels((prev) => [...prev.slice(-29), now]);
    setSuccess((prev) => [...prev.slice(-29), metrics.successCount]);
    setFailure((prev) => [...prev.slice(-29), metrics.failureCount]);
    setResponseTime((prev) => [
      ...prev.slice(-29),
      metrics.averageResponseTimeMs,
    ]);
    setErrorRate((prev) => [...prev.slice(-29), metrics.errorRate]);
  }, [metrics]);

  // const responseTimeChartOptions: ChartOptions<"line"> = {
  //   ...defaultOptions,
  //   scales: {
  //     ...defaultOptions.scales,
  //     y: {
  //       type: "linear",
  //       beginAtZero: true,
  //       ticks: {
  //         ...defaultOptions.scales?.y?.ticks,
  //         stepSize: 20,
  //       },
  //       title: {
  //         ...defaultOptions.scales?.y?.title,
  //         text: "Response Time (ms)",
  //       },
  //     },
  //     x: {
  //       type: "timeseries",
  //       time: {
  //         unit: "second",
  //         tooltipFormat: "HH:mm:ss",
  //         displayFormats: {
  //           second: "HH:mm:ss",
  //         },
  //       },
  //       ticks: {
  //         ...defaultOptions.scales?.x?.ticks,
  //       },
  //     },
  //   },
  // };

  return (
    <div className="chart-container">
      <ChartBox
        title="Success Count"
        data={getChartData(labels, success, "Success Count", "green")}
        options={defaultOptions}
      />
      <ChartBox
        title="Failure Count"
        data={getChartData(labels, failure, "Failure Count", "red")}
        options={defaultOptions}
      />
      <ChartBox
        title="Response Time (ms)"
        data={getChartData(labels, responseTime, "Failure Count", "red")}
        options={defaultOptions}
      />
      <ChartBox
        title="Error Rate (%)"
        data={getChartData(labels, errorRate, "Error Rate (%)", "red")}
        options={defaultOptions}
      />
    </div>
  );
};

export default LoadMetricsChart;
