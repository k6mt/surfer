import React from "react";

interface TabBodyProps {
  tabs: any[];
  activeTab: string | null;
}

const ContentBody: React.FC<TabBodyProps> = ({ tabs, activeTab }) => {
  return (
    <div className="tab-body">
      {tabs.map((tab) =>
        tab.id === activeTab ? (
          tab.isLoading ? (
            <div key={tab.id} className="loading">
              ⏳ 로딩 중...
            </div>
          ) : tab.error ? (
            <div key={tab.id} className="error">
              ❌ {tab.error}
            </div>
          ) : (
            <pre key={tab.id} className="json">
              {JSON.stringify(tab.response, null, 2)}
            </pre>
          )
        ) : null
      )}
    </div>
  );
};

export default ContentBody;
