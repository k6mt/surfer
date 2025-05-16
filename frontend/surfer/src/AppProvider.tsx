import { TabModelsProvider } from "@context/TabModelsProvider";
import { TraceContextProvider } from "@context/TraceProvider";
import { ReactNode } from "react";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TraceContextProvider>
      <TabModelsProvider>{children}</TabModelsProvider>
    </TraceContextProvider>
  );
};

export default AppProvider;
