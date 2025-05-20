import { generateChartKey } from "@utils/charts/generateChartKey";
import { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { TimePoint } from "@_types/shared";

interface ChartBoxProps {
  title: string;
  data: ChartData<"line", TimePoint[]>;
  options?: ChartOptions<"line">;
}

const ChartBox: React.FC<ChartBoxProps> = ({ title, data, options }) => {
  const chartKey = useMemo(
    () => generateChartKey(data, options),
    [data, options]
  );

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div className="chart-content">
        <Line key={chartKey} data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartBox;
