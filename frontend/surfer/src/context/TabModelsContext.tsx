import { TabModel } from "@_types/shared";
import { createContext } from "react";

interface TabsContextType {
  tabModels: TabModel[];
  activeTabModel: string | null; //tab id
  setActiveTabModel: (id: string) => void;
  removeTabModel: (id: string) => void;
  addTabModel: (controller: string, method: string, url: string) => void;
}

export const TabModelsContext = createContext<TabsContextType | null>(null);
