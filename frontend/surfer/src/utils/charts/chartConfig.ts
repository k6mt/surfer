// chartConfig.ts

import { TimePoint } from "@_types/shared";
import { ChartOptions } from "chart.js";

export const getChartData = (
  labels: (string | Date)[],
  data: TimePoint[],
  label: string,
  color: string
) => ({
  labels,
  datasets: [
    {
      label,
      data,
      borderColor: color,
      tension: 0.2,
      pointRadius: 3,
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
        tooltipFormat: "HH:mm:ss",
        displayFormats: {
          second: "HH:mm:ss",
        },
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
    tooltip: {
      enabled: true,
      mode: "x",
      position: "nearest",
    },
  },
};

/** Get X-axis(timeSeries) */

export const getChartOptionsWithRange = (
  startTime: Date,
  endTime: Date
): ChartOptions<"line"> => {
  return {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          stepSize: 200,
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
        type: "time",
        time: {
          unit: "millisecond",
          tooltipFormat: "HH:mm:ss.SSS",
          displayFormats: {
            millisecond: "HH:mm:ss.SSS",
          },
        },
        min: new Date(startTime.getTime() - 500).toISOString(),
        max: new Date(endTime.getTime() + 500).toISOString(),
        ticks: {
          stepSize: 10000,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 12,
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
      tooltip: {
        enabled: true,
        mode: "x",
        position: "nearest",
      },
    },
  };
};
