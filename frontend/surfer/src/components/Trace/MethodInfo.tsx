import InfoCard from "@components/Trace/InfoCard";

import { useTabModelsContext } from "@hooks/useTabModels";
import { cherryPickRoot } from "@utils/ConvertParams";

const MethodInfo = () => {
  const { tabModels, activeTabModel } = useTabModelsContext();

  if (!activeTabModel) return;
  const safeActiveModel = tabModels.find((model) => model.id === activeTabModel);

  const paramRoots = cherryPickRoot(safeActiveModel?.params);

  return (
    <>
      <div className="trace-content">
        <h2 className="text">Method Info</h2>
        <div className="infos">
          <div className="infos-method">
            <InfoCard title="Controller" data={safeActiveModel?.controller} />
            <InfoCard title="Method Type" data={safeActiveModel?.method} />
            <InfoCard title="URL" data={safeActiveModel?.url} />
          </div>
          <div className="infos-params">
            <div className="trace-infos-table">
              <div className="table-title">Paramters</div>
              <div>{paramRoots}</div>
            </div>
            {/* <table>
              <tbody>
                <InfoParamTree data={safeActiveModel?.params} />
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MethodInfo;
