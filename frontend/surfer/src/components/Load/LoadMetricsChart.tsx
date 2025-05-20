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

import { getChartData, getChartOptionsWithEndRange } from "@utils/charts/chartConfig";
import ChartBox from "@components/Load/LoadMetricsChartBox";
import { useTabModelsContext } from "@hooks/useTabModels";

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
  const { tabModels, activeTabModel } = useTabModelsContext();

  const safeActiveModel = tabModels.find((model) => model.id === activeTabModel)!;
  const { chartState } = safeActiveModel;

  // //For TimeSeries
  // useEffect(() => {
  //   if (metrics.isRunning && (!chartState || chartState.success.length === 0)) {
  //     const now = Date.now();
  //     const durationSec = parseInt(loadConfig[2].value, 10);
  //     const startTime = new Date(now);
  //     const endTime = new Date(now + (durationSec + 2) * 1000);
  //     // const labels = Array.from({ length: count }, (_, i) => new Date(now + i * 1000));

  //     updateTabModel(safeActiveModel.id, {
  //       chartState: {
  //         initialized: true,
  //         startTime,
  //         endTime,
  //         success: [],
  //         failure: [],
  //         responseTime: [],
  //         errorRate: [],
  //       },
  //     });
  //   }
  // }, [metrics.isRunning]);

  // useEffect(() => {
  //   if (!metrics.isRunning || !chartState) return;

  //   const xTime = new Date(metrics.timestamp);
  //   const total = metrics.successCount + metrics.failureCount;
  //   const errorRate = total === 0 ? 0 : metrics.failureCount / total;

  //   const newChartState = {
  //     ...chartState,
  //     success: [...chartState.success, { x: xTime, y: metrics.successCount }],
  //     failure: [...chartState.failure, { x: xTime, y: metrics.failureCount }],
  //     responseTime: [...chartState.responseTime, { x: xTime, y: metrics.averageResponseTimeMs }],
  //     errorRate: [...chartState.errorRate, { x: xTime, y: errorRate }],
  //   };

  //   updateTabModel(safeActiveModel.id, { chartState: newChartState });
  // }, [metrics]);

  if (!chartState) return null;

  const { endTime, success, failure, responseTime, errorRate } = chartState;
  const defaultOption = getChartOptionsWithEndRange(endTime);

  /** **/
  const responseTimeChartOption: ChartOptions<"line"> = {
    ...defaultOption,
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          ...defaultOption.scales?.y?.ticks,
          stepSize: 60,
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
          stepSize: 20,
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
        data={getChartData([], success, "Success Count", "green")}
        options={defaultOption}
      />
      <ChartBox
        title="Failure Count"
        data={getChartData([], failure, "Failure Count", "red")}
        options={defaultOption}
      />
      <ChartBox
        title="Response Time (ms)"
        data={getChartData([], responseTime, "Response Time (ms)", "#3674B5")}
        options={responseTimeChartOption}
      />
      <ChartBox
        title="Error Rate (%)"
        data={getChartData([], errorRate, "Error Rate (%)", "#D50B8B")}
        options={errorRateOption}
      />
    </div>
  );
};

export default LoadMetricsChart;
