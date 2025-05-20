import { TabModelsContext } from "@context/TabModelsContext";
import { useContext } from "react";

export const useTabModelsContext = () => {
  const context = useContext(TabModelsContext);
  if (!context) {
    throw new Error(
      "useTabModelsContext는 TabModelsContextProvider 내부에서만 사용 가능합니다."
    );
  }

  return context;
};
