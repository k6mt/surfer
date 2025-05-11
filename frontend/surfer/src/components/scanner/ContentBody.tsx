import { Tab } from "@_types/shared";
import ContentBodySke from "@components/scanner/common/ContentBodySke";
import TabContentTop from "@components/scanner/common/TabContentTop";
import React, { useEffect } from "react";

interface TabBodyProps {
  tabs: Tab[];
  activeTab: string | null;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const ContentBody: React.FC<TabBodyProps> = ({ tabs, activeTab, setTabs }) => {
  const tab = tabs.find((t) => t.id === activeTab);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    if (tab.isLoading) {
      setTabs((prev) => prev.map((t) => (t.id === tab.id ? { ...t, isLoading: false } : t)));
    }
  }, [tabs, activeTab]);

  if (!tab) return;

  return (
    <div className="tab-body">
      {tab.isLoading ? (
        <ContentBodySke />
      ) : (
        <>
          <TabContentTop tab={tab} />
        </>
      )}
    </div>
  );
};

export default ContentBody;

// <pre className="json">
//   <div>id: {tab.id}</div>
//   <div>method: {tab.method}</div>
//   <div>url: {tab.url}</div>
//   <div>응답: {JSON.stringify(tab.response, null, 2)}</div>
// </pre>;
