import { TabModel } from "@_types/shared";
import { TabModelsContext } from "@context/TabModelsContext";
import { useScan } from "@hooks/useScan";
import { ReactNode, useState } from "react";

export const TabModelsProvider = ({ children }: { children: ReactNode }) => {
  const [tabModels, setTabModels] = useState<TabModel[]>([]);
  const [activeTabModel, setActiveTabModel] = useState<string | null>(null);

  const { ApiScanByMethod } = useScan();

  const addTabModel = async (controller: string, method: string, url: string) => {
    const id = `${method}_${url}_${Date.now()}`;
    const raw = await ApiScanByMethod(method, url);

    const newTabModel: TabModel = {
      id,
      controller,
      method,
      url,
      response: null,
      params: raw ?? null,
      trace: null,
      isLoading: false,
      config: null,
    };

    setTabModels((prev) => [...prev, newTabModel]);
    setActiveTabModel(id);
  };

  const removeTabModel = (id: any) => {
    setTabModels((prev) => {
      const curIdx = prev.findIndex((t) => t.id === id);
      const nextTabModels = prev?.filter((t) => t.id !== id);

      if (activeTabModel === id) {
        const nextActiveTabModel = nextTabModels[curIdx - 1] ?? nextTabModels[0] ?? null;
        setActiveTabModel(nextActiveTabModel?.id ?? null);
      }

      return nextTabModels;
    });
  };

  const updateTabModel = (id: string, updates: Partial<TabModel>) => {
    setTabModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updates,
            }
          : m
      )
    );
  };

  return (
    <TabModelsContext.Provider
      value={{
        tabModels,
        activeTabModel,
        setActiveTabModel,
        removeTabModel,
        addTabModel,
        updateTabModel,
      }}
    >
      {children}
    </TabModelsContext.Provider>
  );
};
