import { useTabModelsContext } from "@hooks/useTabModels";
import { ReactNode } from "react";

const CommonContainer = ({ children }: { children: ReactNode }) => {
  const { tabModels, activeTabModel } = useTabModelsContext();
  const noneModel = tabModels.length === 0 || !activeTabModel;

  return (
    <div className={`main-body ${noneModel ? "none" : ""}`}>
      {!noneModel && <div className="outlet">{children}</div>}
    </div>
  );
};

export default CommonContainer;
