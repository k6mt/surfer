// chartConfig.ts

import { ChartOptions } from "chart.js";

export const getChartData = (
  labels: string[],
  data: number[],
  label: string,
  color: string
) => ({
  labels,
  datasets: [
    {
      label,
      data,
      borderColor: color,
      tension: 0.3,
      pointRadius: 0,
    },
  ],
});

export const defaultOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: "linear",
      beginAtZero: true,
      ticks: {
        stepSize: 50,
        font: {
          size: 14,
          family: "'Noto Sans KR', 'sans-serif'",
          weight: "normal",
        },
      },
      title: {
        display: true,
        font: {
          size: 14,
          family: "'Noto Sans KR', 'sans-serif'",
          weight: "normal",
        },
      },
    },
    x: {
      type: "timeseries",
      time: {
        unit: "second",
      },
      ticks: {
        maxRotation: 45,
        font: {
          size: 14,
          family: "'Noto Sans KR', 'sans-serif'",
          weight: "normal",
        },
      },
    },
  },

  plugins: {
    legend: {
      labels: {
        font: {
          size: 16,
          family: "'Noto Sans KR', 'sans-serif'",
          weight: "normal",
        },
      },
    },
  },
};
