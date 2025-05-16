import PageTitle from "@components/common/PageTitle";
import LoadContent from "@components/Load/LoadContent";
import LoadTestForm from "@components/loadtest/LoadTestForm";
import { LoadTestProvider } from "@context/LoadTestContextProvider";

function LoadTest() {
  return (
    <LoadTestProvider>
      <div className="load-container">
        <PageTitle title="Load Test" />
        <LoadContent />
        <LoadTestForm />
      </div>
    </LoadTestProvider>
  );
}

export default LoadTest;
