import ConfigModal from "@components/Load/ConfigModal";
import LoadMetricsChart from "@components/loadtest/LoadMetricsChart";
import { faGear, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTabModelsContext } from "@hooks/useTabModels";
import { useState } from "react";

const LoadContent = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const { tabModels, activeTabModel } = useTabModelsContext();

  const safeActiveModel = tabModels.find(
    (model) => model.id === activeTabModel
  );

  const handleExecute = () => {
    console.log(tabModels);
  };

  if (!safeActiveModel) {
    return <div>Wrong Surfing</div>;
  }

  return (
    <div className="load-content">
      <div className="header">
        <div className="actions">
          <div className="btn-config" onClick={() => setShowConfig((s) => !s)}>
            <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="btn-run" onClick={handleExecute}>
            <FontAwesomeIcon icon={faPlay} />
          </div>

          {showConfig && (
            <div className="modal-overlay">
              <div className="modal-content">
                <ConfigModal
                  baseController={safeActiveModel.controller}
                  baseMethod={safeActiveModel.method}
                  baseUrl={safeActiveModel.url}
                  fields={safeActiveModel.load}
                  id={safeActiveModel.id}
                  onClose={() => setShowConfig(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadMetricsChart />
    </div>
  );
};

export default LoadContent;
