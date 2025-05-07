import LoadMetricsChart from "@components/loadtest/LoadMetricsChart";
import LoadTestForm from "@components/loadtest/LoadTestForm";
import { LoadTestProvider } from "@context/LoadTestContextProvider";

function LoadTest() {
  return (
    <LoadTestProvider>
      <LoadTestForm />
      <LoadMetricsChart />
    </LoadTestProvider>
  );
}

export default LoadTest;
