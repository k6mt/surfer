import { API } from "@apis/axios";
import AnalyzeModal from "@components/Analyze/AnalyzeModal";
import AnalyzeView from "@components/Analyze/AnalyzeView";
import ResponseView from "@components/Trace/DeepInformation/ResponseView";
import InfoCard from "@components/Trace/InfoCard";
import ParamTreeView from "@components/Trace/ParamTreeView";
import { faGear, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTabModelsContext } from "@hooks/useTabModels";
import { useTrace } from "@hooks/useTrace";
import { useEffect, useRef, useState } from "react";

const AnalyzeInfo = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { tabModels, activeTabModel, updateTabModel } = useTabModelsContext();
  const { requestWithHeader, AnanlyzeMethod } = useTrace();

  const safeActiveModel = tabModels.find(
    (model) => model.id === activeTabModel
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showConfig &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowConfig(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showConfig]);

  if (!safeActiveModel) {
    return <div>Wrong Surfing</div>;
  }

  const handleExecute = async () => {
    if (!safeActiveModel.config) {
      // no config
      const response = await requestWithHeader({
        id: safeActiveModel.id,
        method: safeActiveModel.method.toLowerCase() as any,
        url: safeActiveModel.url,
      });

      if (response.status === 200) {
        updateTabModel(safeActiveModel.id, { response: response.data });
      }

      const analysis = await AnanlyzeMethod(safeActiveModel.id);

      if (analysis.status === 200) {
        updateTabModel(safeActiveModel.id, { analysis: analysis.data });
      }

      return;
    }

    const { pathVariables, params, body } = safeActiveModel.config;

    const response = await requestWithHeader({
      id: safeActiveModel.id,
      method: safeActiveModel.method.toLowerCase() as any,
      url: safeActiveModel.url,
      pathVariables: pathVariables,
      params: params,
      data: body,
    });

    if (response.status === 200) {
      updateTabModel(safeActiveModel.id, { response: response.data });
    }

    const analysis = await AnanlyzeMethod(safeActiveModel.id);

    if (analysis.status === 200) {
      updateTabModel(safeActiveModel.id, { analysis: analysis.data });
    }

    return;
  };

  return (
    <>
      <div className="base-information">
        <div className="header">
          <h2>Base Information</h2>
        </div>
        <div className="infos">
          <div className="infos-method">
            <InfoCard title="Controller" data={safeActiveModel?.controller} />
            <InfoCard title="Method Type" data={safeActiveModel?.method} />
            <InfoCard title="URL" data={safeActiveModel?.url} />
          </div>
          <div className="infos-params">
            <div className="trace-infos-table">
              <div className="table-title">Paramters</div>
              <ParamTreeView data={safeActiveModel?.params} />
            </div>
          </div>
        </div>
      </div>

      <div className="deep-information">
        <div className="header">
          <h2>Analyze Method</h2>
          <div className="actions" ref={dropdownRef}>
            <div
              className="btn-config"
              onClick={() => setShowConfig((s) => !s)}
            >
              <FontAwesomeIcon icon={faGear} />
            </div>
            <div className="btn-run" onClick={handleExecute}>
              <FontAwesomeIcon icon={faPlay} />
            </div>

            {showConfig && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <AnalyzeModal
                    controller={safeActiveModel.controller}
                    method={safeActiveModel.method}
                    url={safeActiveModel.url}
                    id={safeActiveModel.id}
                    onClose={() => setShowConfig(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="infos-trace">
          <div className="table-title">Response</div>
          <div className="trace-wrapper">
            <ResponseView
              data={safeActiveModel.response}
              placeholder={<>API를 서핑해보세요</>}
            />
          </div>
        </div>

        <div className="infos-response">
          <div className="table-title">Analyze</div>
          <div className="trace-wrapper">
            <AnalyzeView data={safeActiveModel?.analysis} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyzeInfo;
