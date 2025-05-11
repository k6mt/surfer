import { Tab } from "@_types/shared";
// import { API } from "@apis/axios";
import ScannerContent from "@components/scanner/ScannerContent";
import ScannerList from "@components/scanner/ScannerList";
import { useState } from "react";

function Home() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleApiClick = async (method: string, url: string) => {
    try {
      // const response = await API.get("/api/scan", {
      //   params: {
      //     methodType: method,
      //     encodeUrl: url,
      //   },
      // });

      const id = `${method}_${url}_${Date.now()}`;
      const newTab: Tab = { id, method, url, isLoading: true };
      setTabs((prev) => [...prev, newTab]);
      setActiveTab(id);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="scanner-container">
      <ScannerList onApiClick={handleApiClick} />
      <ScannerContent
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setTabs={setTabs}
        removeTab={(id) => {
          setTabs((prev) => prev.filter((t) => t.id !== id));
          if (activeTab === id) setActiveTab(null);
        }}
      />
    </div>
  );
}

export default Home;
