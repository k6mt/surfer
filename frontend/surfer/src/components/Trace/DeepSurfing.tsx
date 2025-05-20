import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faClose } from "@fortawesome/free-solid-svg-icons";
import { useTabModelsContext } from "@hooks/useTabModels";
import { TabModel } from "@_types/shared";

type KeyValue = { key: string; value: string };

interface DeepSurfingProps {
  controller: string;
  method: string;
  url: string;
  id: string;
  onClose: () => void;
}

const DeepSurfing: React.FC<DeepSurfingProps> = ({
  controller,
  method,
  url,
  id,
  onClose,
}) => {
  const { tabModels, updateTabModel } = useTabModelsContext();

  // dynamic fields
  const [pathVar, setPathVar] = useState<KeyValue[]>([]);
  const [params, setParams] = useState<KeyValue[]>([]);
  const [body, setBody] = useState<string>("");

  // SetState helper
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
    const newList = list.map((it, i) =>
      i === idx ? { ...it, [field]: val } : it
    );
    setter(newList);
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

    updateTabModel(id, { config: config });

    onClose();
  };

  useEffect(() => {
    const current: TabModel | undefined = tabModels.find((t) => t.id === id);
    if (current?.config) {
      const {
        pathVariables = {},
        params: cfgParams = {},
        body: cfgBody,
      } = current.config;

      setPathVar(
        Object.entries(pathVariables).map(([key, value]) => ({
          key,
          value: value as string,
        }))
      );

      setParams(
        Object.entries(cfgParams).map(([key, value]) => ({
          key,
          value: value as string,
        }))
      );

      setBody(cfgBody ? JSON.stringify(cfgBody, null, 2) : "");
    }
  }, [id, tabModels]);

  return (
    <div className="deep-surfing-container">
      <div className="deep-surfing-header">
        <h3>DeepSurfing</h3>
        <div className="btn-close" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </div>
      </div>

      <div className="deep-surfing-main">
        <div className="deep-surfing-info">
          <strong>Controller:</strong> {controller}
          <br />
          <strong>Method:</strong> {method}
          <br />
          <strong>URL:</strong> {url}
        </div>

        <div className="field-section">
          <h4>Path Variables</h4>
          {pathVar.map((pv, i) => (
            <div key={i} className="field-row">
              <input
                placeholder="name"
                value={pv.key}
                onChange={(e) =>
                  handleFieldChange(
                    pathVar,
                    setPathVar,
                    i,
                    "key",
                    e.target.value
                  )
                }
              />
              <input
                placeholder="value"
                value={pv.value}
                onChange={(e) =>
                  handleFieldChange(
                    pathVar,
                    setPathVar,
                    i,
                    "value",
                    e.target.value
                  )
                }
              />

              <div
                className="field-row-remove"
                onClick={() => handleRemoveField(pathVar, setPathVar, i)}
              >
                <FontAwesomeIcon icon={faCircleXmark} size="xl" />
              </div>
            </div>
          ))}
          <button onClick={() => handleAddField(pathVar, setPathVar)}>
            + Add PathVar
          </button>
        </div>

        <div className="field-section">
          <h4>Query Params</h4>
          {params.map((p, i) => (
            <div key={i} className="field-row">
              <input
                placeholder="name"
                value={p.key}
                onChange={(e) =>
                  handleFieldChange(params, setParams, i, "key", e.target.value)
                }
              />
              <input
                placeholder="value"
                value={p.value}
                onChange={(e) =>
                  handleFieldChange(
                    params,
                    setParams,
                    i,
                    "value",
                    e.target.value
                  )
                }
              />

              <div
                className="field-row-remove"
                onClick={() => handleRemoveField(params, setParams, i)}
              >
                <FontAwesomeIcon icon={faCircleXmark} size="xl" />
              </div>
            </div>
          ))}
          <button onClick={() => handleAddField(params, setParams)}>
            + Add Param
          </button>
        </div>

        {method.toLowerCase() !== "get" &&
          method.toLowerCase() !== "delete" && (
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

      <div className="actions-footer">
        <button className="btn-save" onClick={handleSave}>
          <p>Save</p>
        </button>
      </div>
    </div>
  );
};

export default DeepSurfing;
