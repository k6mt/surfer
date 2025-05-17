import ConfigModal from "@components/Load/ConfigModal";
import LoadMetricsChart from "@components/Load/LoadMetricsChart";
import { faGear, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useState } from "react";

const LoadContent = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const { tabModels, activeTabModel, startLoadTest } = useTabModelsContext();
  const safeActiveModel = tabModels.find((model) => model.id === activeTabModel)!;

  // const { onStartLoadTest } = useLoad(safeActiveModel.id);

  useEffect(() => {
    console.log(safeActiveModel.test);
    console.log(safeActiveModel.chartState.success);
  }, [safeActiveModel.test]);

  useEffect(() => {
    console.log(safeActiveModel.id);
  }, [safeActiveModel.id]);

  return (
    <>
      {safeActiveModel && (
        <div className="load-content">
          <div className="header">
            <div className="actions">
              <div className="btn-config" onClick={() => setShowConfig((s) => !s)}>
                <FontAwesomeIcon icon={faGear} />
              </div>
              <div className="btn-run">
                <FontAwesomeIcon icon={faPlay} onClick={() => startLoadTest(safeActiveModel.id)} />
              </div>

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
