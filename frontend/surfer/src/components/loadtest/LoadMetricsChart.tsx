import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
} from "chart.js";

import { useEffect, useState } from "react";
import ChartBox from "@components/loadtest/LoadMetricsChartBox";
import {
  getChartData,
  getChartOptionsWithRange,
} from "@utils/charts/chartConfig";
import { useLoadTestContext } from "@hooks/useLoadTestContext";
import { TimePoint } from "@_types/shared";

ChartJS.register(
  LineElement,
  CategoryScale,
  TimeSeriesScale,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LoadMetricsChart = () => {
  const { metrics, config } = useLoadTestContext();

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(
    new Date(new Date().getTime() + 60000)
  );
  const [labels, setLabels] = useState<Date[]>([new Date()]);
  const [success, setSuccess] = useState<TimePoint[]>([]);
  const [failure, setFailure] = useState<TimePoint[]>([]);
  const [responseTime, setResponseTime] = useState<TimePoint[]>([]);
  const [errorRate, setErrorRate] = useState<TimePoint[]>([]);

  useEffect(() => {
    const now = new Date();

    const total = metrics.successCount + metrics.failureCount;
    const errorRate = total === 0 ? 0 : metrics.failureCount / total;

    setSuccess((prev) => [...prev, { x: now, y: metrics.successCount }]);

    setFailure((prev) => [...prev, { x: now, y: metrics.failureCount }]);
    setResponseTime((prev) => [
      ...prev,
      { x: now, y: metrics.averageResponseTimeMs },
    ]);

    setErrorRate((prev) => [
      ...prev,
      {
        x: now,
        y: errorRate, //
      },
    ]);
  }, [metrics]);

  //For TimeSeries
  useEffect(() => {
    if (metrics.isRunning) {
      //Clear DataSet
      setSuccess([]);
      setFailure([]);
      setResponseTime([]);
      setErrorRate([]);

      const now = Date.now();
      const count = Math.floor((config.duration * 1000) / 1000) + 1;
      const labelArray = Array.from(
        { length: count },
        (_, i) => new Date(now + i * 1000)
      );
      setStartTime(new Date(now));
      setEndTime(new Date(now + (count - 1) * 1000));
      setLabels(labelArray);
    }
  }, [metrics.isRunning]);

  const defaultOption = getChartOptionsWithRange(startTime, endTime);

  /** **/
  const responseTimeChartOption: ChartOptions<"line"> = {
    ...defaultOption,
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          ...defaultOption.scales?.y?.ticks,
          stepSize: 20,
        },
      },
      x: {
        ...(defaultOption.scales?.x || {}),
      },
    },
  };

  const errorRateOption: ChartOptions<"line"> = {
    ...defaultOption,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          ...defaultOption.scales?.y?.ticks,
          stepSize: 10,
          callback: (value: number | string) => `${value}%`,
        },
      },
      x: {
        ...(defaultOption.scales?.x || {}),
      },
    },
  };

  return (
    <div className="chart-container">
      <ChartBox
        title="Success Count"
        data={getChartData(labels, success, "Success Count", "green")}
        options={defaultOption}
      />
      <ChartBox
        title="Failure Count"
        data={getChartData(labels, failure, "Failure Count", "red")}
        options={defaultOption}
      />
      <ChartBox
        title="Response Time (ms)"
        data={getChartData(
          labels,
          responseTime,
          "Response Time (ms)",
          "#3674B5"
        )}
        options={responseTimeChartOption}
      />
      <ChartBox
        title="Error Rate (%)"
        data={getChartData(labels, errorRate, "Error Rate (%)", "#D50B8B")}
        options={errorRateOption}
      />
    </div>
  );
};

export default LoadMetricsChart;
