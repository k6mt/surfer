import { LoadField } from "@_types/shared";
import CountFields from "@components/Load/CountFields";
import { faCircleXmark, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useState } from "react";

type KeyValue = { key: string; value: string };

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

  // dynamic fields
  const [pathVar, setPathVar] = useState<KeyValue[]>([]);
  const [params, setParams] = useState<KeyValue[]>([]);
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    if (fields) {
      setFieldState(fields);
    }
  }, [fields]);

  // React SetState helper
  const handleAddField = (
    list: KeyValue[],
    setter: React.Dispatch<React.SetStateAction<KeyValue[]>>
  ) => setter([...list, { key: "", value: "" }]);

  const handleRemoveField = (
    list: KeyValue[],
    setter: React.Dispatch<React.SetStateAction<KeyValue[]>>,
    idx: number
  ) => setter(list.filter((_, i) => i !== idx));

  const handleFieldChange = (
    list: KeyValue[],
    setter: React.Dispatch<React.SetStateAction<KeyValue[]>>,
    idx: number,
    field: "key" | "value",
    val: string
  ) => {
    const newList = list.map((it, i) => (i === idx ? { ...it, [field]: val } : it));
    setter(newList);
  };

  //LoadConfig
  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedFields = [...fieldState];
    updatedFields[index].value = e.target.value;
    setFieldState(updatedFields);
  };

  const buildRecord = (list: KeyValue[]) =>
    list.reduce<Record<string, string>>((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});

  const handleSave = () => {
    const config = {
      pathVariables: buildRecord(pathVar),
      params: buildRecord(params),
      body: body ? JSON.parse(body) : null,
    };

    const updatedFields = fieldState;

    updateTabModel(id, { config: config });
    updateTabModel(id, { loadConfig: updatedFields });

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

        <div className="form-data-container">
          <div className="form-data-count">
            <CountFields field={fieldState[0]} index={0} handleInputChange={handleConfigChange} />

            <CountFields field={fieldState[1]} index={1} handleInputChange={handleConfigChange} />

            <CountFields field={fieldState[2]} index={2} handleInputChange={handleConfigChange} />
          </div>
        </div>

        <div className="field-section">
          <h4>Path Variables</h4>
          {pathVar.map((pv, i) => (
            <div key={i} className="field-row">
              <input
                placeholder="name"
                value={pv.key}
                onChange={(e) => handleFieldChange(pathVar, setPathVar, i, "key", e.target.value)}
              />
              <input
                placeholder="value"
                value={pv.value}
                onChange={(e) => handleFieldChange(pathVar, setPathVar, i, "value", e.target.value)}
              />

              <div
                className="field-row-remove"
                onClick={() => handleRemoveField(pathVar, setPathVar, i)}
              >
                <FontAwesomeIcon icon={faCircleXmark} size="xl" />
              </div>
            </div>
          ))}
          <button onClick={() => handleAddField(pathVar, setPathVar)}>+ Add PathVar</button>
        </div>

        <div className="field-section">
          <h4>Query Params</h4>
          {params.map((p, i) => (
            <div key={i} className="field-row">
              <input
                placeholder="name"
                value={p.key}
                onChange={(e) => handleFieldChange(params, setParams, i, "key", e.target.value)}
              />
              <input
                placeholder="value"
                value={p.value}
                onChange={(e) => handleFieldChange(params, setParams, i, "value", e.target.value)}
              />

              <div
                className="field-row-remove"
                onClick={() => handleRemoveField(params, setParams, i)}
              >
                <FontAwesomeIcon icon={faCircleXmark} size="xl" />
              </div>
            </div>
          ))}
          <button onClick={() => handleAddField(params, setParams)}>+ Add Param</button>
          {baseMethod.toLowerCase() !== "get" && baseMethod.toLowerCase() !== "delete" && (
            <div className="field-section">
              <h4>Request Body (JSON)</h4>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"name":"john","age":25}'
              />
            </div>
          )}
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
