import { Tab } from "@_types/shared";
import ContentBody from "@components/scanner/ContentBody";
import ContentHeader from "@components/scanner/ContentHeader";
import React from "react";

interface ScannerContentProps {
  tabs: Tab[];
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  removeTab: (id: string) => void;
}

const ScannerContent: React.FC<ScannerContentProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  setTabs,
  removeTab,
}) => {
  return (
    <div className="scanner-content">
      <ContentHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        removeTab={removeTab}
      />
      <ContentBody
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setTabs={setTabs}
      />
    </div>
  );
};

export default ScannerContent;
