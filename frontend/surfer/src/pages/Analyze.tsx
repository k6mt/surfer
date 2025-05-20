import AnalyzeContent from "@components/Analyze/AnalyzeContent";
import PageTitle from "@components/common/PageTitle";

const Analyze = () => {
  return (
    <div className="analyze-container">
      <PageTitle title="Analyze" />
      <AnalyzeContent />
    </div>
  );
};

export default Analyze;
