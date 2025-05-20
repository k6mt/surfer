import { TimePoint } from "@_types/shared";
import { ChartData, ChartOptions } from "chart.js";

export const generateChartKey = (
  data: ChartData<"line", TimePoint[]>,
  options?: ChartOptions<"line">
): string => {
  // 라벨이 날짜 객체인지 확인 후 timestamp로 변환
  const labelHash = (data.labels ?? [])
    .map((label) => {
      if (label instanceof Date) return label.getTime();
      if (typeof label === "string" && !isNaN(Date.parse(label)))
        return Date.parse(label);
      return label;
    })
    .join(",");

  // 여러 데이터셋을 지원하도록 처리
  const datasetHash = (data.datasets ?? [])
    .map((ds) => (ds.data as TimePoint[]).join(","))
    .join("|");

  // 옵션에서 x 스케일 타입을 가져옴
  const xAxisType =
    (options?.scales?.x as any)?.type ??
    (options?.scales as any)?.xAxis?.type ??
    "category";

  return `key-${xAxisType}-${labelHash}-${datasetHash}`;
};
