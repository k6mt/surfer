import { TabModel } from "@_types/shared";
import { TabModelsContext } from "@context/TabModelsContext";
import { ReactNode, useState } from "react";

export const TabModelsProvider = ({ children }: { children: ReactNode }) => {
  const [tabModels, setTabModels] = useState<TabModel[]>([]);

  const [activeTabModel, setActiveTabModel] = useState<string | null>(null);

  const addTabModel = async (
    controller: string,
    method: string,
    url: string
  ) => {
    const id = `${method}_${url}_${Date.now()}`;
    const newTabModel: TabModel = {
      id,
      controller,
      method,
      url,
      isLoading: false,
    };

    setTabModels((prev) => [...prev, newTabModel]);
    setActiveTabModel(id);
  };

  const removeTabModel = (id: any) => {
    setTabModels((prev) => {
      const curIdx = prev.findIndex((t) => t.id === id);
      const nextTabModels = prev?.filter((t) => t.id !== id);

      if (activeTabModel === id) {
        const nextActiveTabModel =
          nextTabModels[curIdx - 1] ?? nextTabModels[0] ?? null;
        setActiveTabModel(nextActiveTabModel?.id ?? null);
      }

      return nextTabModels;
    });
  };

  return (
    <TabModelsContext.Provider
      value={{
        tabModels,
        activeTabModel,
        setActiveTabModel,
        removeTabModel,
        addTabModel,
      }}
    >
      {children}
    </TabModelsContext.Provider>
  );
};
