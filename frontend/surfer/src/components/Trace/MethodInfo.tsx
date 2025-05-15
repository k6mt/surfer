import DeepSurfing from "@components/Trace/DeepSurfing";
import InfoCard from "@components/Trace/InfoCard";
import ParamTreeView from "@components/Trace/ParamTreeView";
import TraceTreeView from "@components/Trace/TraceTreeView";

import { useTabModelsContext } from "@hooks/useTabModels";
import { useEffect, useRef, useState } from "react";

const MethodInfo = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { tabModels, activeTabModel } = useTabModelsContext();

  if (!activeTabModel) return;

  const safeActiveModel = tabModels.find(
    (model) => model.id === activeTabModel
  );

  if (safeActiveModel === undefined) return <div>Wrong Surfing</div>;

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

  const handleExecute = () => {};

  return (
    <>
      <div className="trace-content">
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
            <h2>Deep Information</h2>
            <div className="actions" ref={dropdownRef}>
              <button
                className="btn-config"
                onClick={() => setShowConfig((s) => !s)}
              >
                설정
              </button>
              <button className="btn-run" onClick={handleExecute}>
                실행
              </button>

              {showConfig && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <DeepSurfing
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
            <div className="table-title">Trace</div>
            <TraceTreeView data={safeActiveModel.params} />
          </div>

          <div className="infos-response">
            <div className="table-title">Trace</div>
            <TraceTreeView data={safeActiveModel.params} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MethodInfo;
