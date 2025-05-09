import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
interface TabHeaderProps {
  tabs: any[];
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  removeTab: (id: string) => void;
}

const ContentHeader: React.FC<TabHeaderProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  removeTab,
}) => {
  return (
    <div className="tab-header">
      <div className="icon icon-left">
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-method">{tab.method}</span>
            <span className="tab-url" title={tab.url}>
              {tab.url}
            </span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="icon icon-right">
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </div>
  );
};

export default ContentHeader;
