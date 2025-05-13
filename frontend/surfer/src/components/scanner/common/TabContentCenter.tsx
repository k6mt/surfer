import { TabProps } from "@_types/shared";
import React from "react";

const TabContentCenter: React.FC<TabProps> = ({ tab, onFieldChange }) => {
  console.log(onFieldChange);
  return (
    <div className="tab-content center-container">
      <div className="trace">
        {tab.response?.trace
          ? JSON.stringify(tab.response?.trace, null, 2)
          : ""}
      </div>
    </div>
  );
};

export default TabContentCenter;
