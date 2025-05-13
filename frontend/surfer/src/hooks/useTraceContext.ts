import { TraceContext } from "@context/TraceContext";
import { useContext } from "react";

export const useTraceContext = () => {
  const context = useContext(TraceContext);
  if (!context) {
    throw new Error(
      "useTraceContext는 TraceContextProvider 내부에서만 사용 가능합니다."
    );
  }
  return context;
};
