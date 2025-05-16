import { Field } from "@_types/shared";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTabModelsContext } from "@hooks/useTabModels";

interface ConfigModalProps {
  baseController: string;
  baseMethod: string;
  baseUrl: string;
  fields: Field[];
  id: string;
  onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  baseController,
  baseMethod,
  baseUrl,
  fields,
  id,
  onClose,
}) => {
  const { updateTabModel } = useTabModelsContext();

  const handleSave = () => {
    /*
            1. Tab에 저장된 fields를 찾는다
            2. fields 비교해 업데이트 되어야함
        */
    console.log(fields);
    console.log(id);
    console.log(updateTabModel);
    onClose();
  };

  return (
    <div className="deep-surfing-container">
      <div className="deep-surfing-header">
        <h3>LoadTest Configuration</h3>
        <div className="btn-close" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </div>
      </div>

      <div className="deep-surfing-main">
        <div className="deep-surfing-info">
          <strong>Controller:</strong> {baseController}
          <br />
          <strong>Method:</strong> {baseMethod}
          <br />
          <strong>URL:</strong> {baseUrl}
        </div>
      </div>

      <div className="actions-footer">
        <button className="btn-save" onClick={handleSave}>
          <p>Save</p>
        </button>
      </div>
    </div>
  );
};

export default ConfigModal;
