import { LoadField } from "@_types/shared";
import BodyFields from "@components/Load/BodyFields";
import CountFields from "@components/Load/CountFields";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useState } from "react";

interface ConfigModalProps {
  baseController: string;
  baseMethod: string;
  baseUrl: string;
  fields: LoadField[] | null;
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

  const [fieldState, setFieldState] = useState<LoadField[]>(fields || []);

  useEffect(() => {
    if (fields) {
      setFieldState(fields);
    }
  }, [fields]);

  const handleSave = () => {
    const updatedFields = fieldState;
    updateTabModel(id, { load: updatedFields });
    onClose();
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => {
    const updatedFields = [...fieldState];
    updatedFields[index].value = e.target.value;
    setFieldState(updatedFields);
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

        <div className="form-data-container">
          <div className="form-data-count">
            <CountFields
              field={fieldState[0]}
              index={0}
              handleInputChange={handleFieldChange}
            />

            <CountFields
              field={fieldState[1]}
              index={1}
              handleInputChange={handleFieldChange}
            />

            <CountFields
              field={fieldState[2]}
              index={2}
              handleInputChange={handleFieldChange}
            />
          </div>
          <div className="form-data-body">
            <BodyFields
              field={fieldState[3]}
              index={3}
              handleInputChange={handleFieldChange}
            />
          </div>
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
