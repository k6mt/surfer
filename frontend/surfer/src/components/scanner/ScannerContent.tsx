import ContentBody from "@components/scanner/ContentBody";
import ContentHeader from "@components/scanner/ContentHeader";
import React from "react";

interface Tab {
  id: string;
  method: string;
  url: string;
  response?: any;
  isLoading: boolean;
  error?: string;
}

interface ScannerContentProps {
  tabs: Tab[];
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  removeTab: (id: string) => void;
}

const ScannerContent: React.FC<ScannerContentProps> = ({
  tabs,
  activeTab,
  setActiveTab,
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
      <ContentBody tabs={tabs} activeTab={activeTab} />
      {/* <div className="tab-headers">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "active" : ""}
          >
            {tab.method} {tab.url}
          </button>
        ))}
      </div>

      <div className="tab-body">
        {tabs.map((tab) =>
          tab.id === activeTab ? (
            <pre key={tab.id} className="response-view">
              {JSON.stringify(tab.response, null, 2)}
            </pre>
          ) : null
        )}
      </div> */}
    </div>
  );
};

export default ScannerContent;
