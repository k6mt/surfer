import SurferItem from "@components/SurferList/SurferItem";
import { useTraceContext } from "@hooks/useTraceContext";

const SurferList = ({
  onApiClick,
}: {
  onApiClick: (method: string, url: string) => void;
}) => {
  const { apis } = useTraceContext();

  return (
    <div className="aside_surfer">
      <div className="aside-surfer_title">
        <p>APIS</p>
      </div>
      <div className="aside_surfer_box">
        <div className="aside_surfer_list">
          {apis &&
            apis.map((api: any) => (
              <SurferItem
                key={api.url}
                method={api.method}
                url={api.url}
                onClick={() => onApiClick(api.method, api.url)}
              />
            ))}
        </div>
        <div className="aside_surfer_scorll"></div>
      </div>
    </div>
  );
};

export default SurferList;
