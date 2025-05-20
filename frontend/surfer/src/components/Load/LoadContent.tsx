import ConfigModal from "@components/Load/ConfigModal";
import LoadMetricsChart from "@components/Load/LoadMetricsChart";
import { faGear, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useState } from "react";

const LoadContent = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const { tabModels, activeTabModel, startLoadTest, stopLoadTest } =
    useTabModelsContext();
  const safeActiveModel = tabModels.find(
    (model) => model.id === activeTabModel
  )!;

  // const { onStartLoadTest } = useLoad(safeActiveModel.id);

  useEffect(() => {
    console.log(safeActiveModel.id);
  }, [safeActiveModel.id]);

  return (
    <>
      {safeActiveModel && (
        <div className="load-content">
          <div className="header">
            <div className="actions">
              <div
                className="btn-config"
                onClick={() => setShowConfig((s) => !s)}
              >
                <FontAwesomeIcon icon={faGear} />
              </div>

              {safeActiveModel.metrics.isRunning ? (
                <div
                  className="btn-run"
                  onClick={() => stopLoadTest(safeActiveModel.id)}
                >
                  <FontAwesomeIcon icon={faStop} />
                </div>
              ) : (
                <div
                  className="btn-run"
                  onClick={() => startLoadTest(safeActiveModel.id)}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              )}

              {showConfig && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <ConfigModal
                      baseController={safeActiveModel.controller}
                      baseMethod={safeActiveModel.method}
                      baseUrl={safeActiveModel.url}
                      fields={safeActiveModel.loadConfig}
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
      )}
    </>
  );
};

export default LoadContent;
