import { Field, Tab } from "@_types/shared";
import UrlSendbox from "@components/common/UrlSendbox";
import { useLoadTest } from "@hooks/useLoadTest";

const TabContentTop = ({ tab }: { tab: Tab }) => {
  const method: Field = {
    name: "method",
    label: "HTTP Method",
    type: "select",
    options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    state: useLoadTest(tab.method, (value) =>
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value)
    ),
  };

  const url: Field = {
    name: "url",
    label: "Target URL",
    type: "text",
    state: useLoadTest(tab.url, (value: string) => value.trim() !== ""),
  };

  return (
    <div className="tab-content top-container">
      <UrlSendbox method={method} url={url} isOption={false} />
    </div>
  );
};

export default TabContentTop;
