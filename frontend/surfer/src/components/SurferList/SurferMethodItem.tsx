import { useTabModelsContext } from "@hooks/useTabModels";

const SurferMethodItem = ({
  controller,
  method,
  url,
}: {
  controller: any | string | null;
  method: any;
  url: any;
}) => {
  const { addTabModel } = useTabModelsContext();

  return (
    <div
      className="method-item-box"
      onClick={() => addTabModel(controller, method, url)}
    >
      <div className={`method ${method.toLowerCase()}`}>{method}</div>
      <div className="url">
        <p>{url}</p>
      </div>
    </div>
  );
};

export default SurferMethodItem;
