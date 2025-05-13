import { Tab } from "@_types/shared";
import { API } from "@apis/axios";
import ContentBodySke from "@components/scanner/common/ContentBodySke";
import TabContentBottom from "@components/scanner/common/TabContentBottom";
import TabContentCenter from "@components/scanner/common/TabContentCenter";
import TabContentTop from "@components/scanner/common/TabContentTop";
import React, { useEffect } from "react";

interface TabBodyProps {
  tabs: Tab[];
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const ContentBody: React.FC<TabBodyProps> = ({ tabs, activeTab, setTabs }) => {
  const tab = tabs.find((t) => t.id === activeTab);

  useEffect(() => {
    if (tab?.isLoading) {
      setTabs((prev) =>
        prev.map((t) => (t.id === tab.id ? { ...t, isLoading: false } : t))
      );
    }
  }, [tab?.id]);

  if (!tab) return;
  if (tab.isLoading) return <ContentBodySke />;

  const handleTabFieldChange = (
    tabId: string | undefined,
    field: "method" | "url" | "response",
    value: any
  ) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, [field]: value } : t))
    );
  };

  const handleSumbit = async (event: React.FormEvent) => {
    event.preventDefault();

    const baseURL = tab.url;
    const baseHeader = tab.id;
    const baseMethod = tab.method;

    try {
      const [originalRes, traceRes] = await Promise.all([
        API.get(baseURL, {
          headers: {
            "X-Surfer-Header": baseHeader,
          },
        }),
        API.get("/trace", {
          headers: {
            "X-Surfer-Header": baseHeader,
          },
          params: {
            url: baseURL,
            method: baseMethod,
          },
        }),
      ]);

      if (originalRes.status === 200 && traceRes.status === 200) {
        handleTabFieldChange(tab.id, "response", {
          trace: traceRes.data,
          original: originalRes.data,
        });
        console.log(originalRes.data);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="tab-body">
      <form onSubmit={handleSumbit}>
        <TabContentTop tab={tab} onFieldChange={handleTabFieldChange} />
        <TabContentCenter tab={tab} onFieldChange={handleTabFieldChange} />
        <TabContentBottom tab={tab} onFieldChange={handleTabFieldChange} />
      </form>
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
