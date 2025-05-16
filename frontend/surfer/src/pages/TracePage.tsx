import PageTitle from "@components/common/PageTitle";
import TraceContent from "@components/Trace/TraceContent";

const TracePage = () => {
  return (
    <div className="trace-container">
      <PageTitle title="Trace" />
      <TraceContent />
    </div>
  );
};

export default TracePage;
