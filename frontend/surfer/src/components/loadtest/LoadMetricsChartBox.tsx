import { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

interface ChartBoxProps {
  title: string;
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const ChartBox: React.FC<ChartBoxProps> = ({ title, data, options }) => {
  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div className="chart-content">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartBox;
