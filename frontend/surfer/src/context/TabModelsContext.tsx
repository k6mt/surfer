import { TabModel } from "@_types/shared";
import { createContext } from "react";

interface TabsContextType {
  tabModels: TabModel[];
  activeTabModel: string | null; //tab id
  setActiveTabModel: (id: string) => void;
  removeTabModel: (id: string) => void;
  addTabModel: (controller: string, method: string, url: string) => void;
  updateTabModel: (id: string, updates: Partial<TabModel>) => void;
  startLoadTest: (id: string) => Promise<void>;
  stopLoadTest: (id: string) => void;
}

export const TabModelsContext = createContext<TabsContextType | null>(null);
