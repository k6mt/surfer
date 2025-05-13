import { TabProps } from "@_types/shared";

const TabContentBottom: React.FC<TabProps> = ({ tab, onFieldChange }) => {
  console.log(onFieldChange);
  return (
    <div className="tab-content bottom-container">
      <div className="title">
        <p>Response</p>
      </div>
      <div className="response">{tab.response?.original}</div>
    </div>
  );
};

export default TabContentBottom;
