import { useTabModelsContext } from "@hooks/useTabModels";

const TraceContent = () => {
  const { tabModels, activeTabModel } = useTabModelsContext();

  if (!activeTabModel) return;
  const safeActiveModel = tabModels.find(
    (model) => model.id === activeTabModel
  );
  return (
    <>
      <div className="trace-controller">{safeActiveModel?.controller}</div>
      <div className="trace-method">{safeActiveModel?.method}</div>
      <div className="trace-url">{safeActiveModel?.url}</div>
    </>
  );
};

export default TraceContent;
