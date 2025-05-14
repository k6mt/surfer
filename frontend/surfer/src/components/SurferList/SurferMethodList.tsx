import { useTabModelsContext } from "@hooks/useTabModels";
import SurferMethodItem from "./SurferMethodItem";

const SurferMethodList = ({
  controller,
  methods,
}: {
  controller: any | string | null;
  methods: any;
}) => {
  return (
    <div className="method">
      <div className="method-inner">
        {methods.map((item: any) => (
          <SurferMethodItem
            controller={controller}
            method={item.method}
            url={item.url}
          />
        ))}
      </div>
    </div>
  );
};

export default SurferMethodList;
