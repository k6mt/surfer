import { Field, TabProps } from "@_types/shared";
import UrlSendbox from "@components/common/UrlSendbox";

const TabContentTop: React.FC<TabProps> = ({ tab, onFieldChange }) => {
  const validateMethod = (value: string) =>
    ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value);

  const validateUrl = (value: string) => value.trim() !== "";

  const method: Field = {
    name: "method",
    label: "HTTP Method",
    type: "select",
    options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    state: {
      value: tab.method,
      handleInputChange(event) {
        onFieldChange(tab.id, "method", event.target.value);
      },
      hasError: validateMethod(tab.method),
    },
  };

  const url: Field = {
    name: "url",
    label: "Target URL",
    type: "text",
    state: {
      value: tab.url,
      handleInputChange(event) {
        onFieldChange(tab.id, "url", event.target.value);
      },
      hasError: validateUrl(tab.url),
    },
  };

  return (
    <div className="tab-content top-container">
      <UrlSendbox method={method} url={url} isOption={false} />
    </div>
  );
};

export default TabContentTop;
