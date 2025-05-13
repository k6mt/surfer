import SurferItem from "@components/SurferList/SurferItem";
import { useTraceContext } from "@hooks/useTraceContext";

const SurferList = () => {
  const { apis } = useTraceContext();

  console.log(apis);

  return (
    <div className="aside_surfer">
      <div className="aside_surfer_title">
        <p>APIS</p>
      </div>
      <div className="aside_surfer_box">
        <div className="aside_surfer_list">
          {apis &&
            Object.entries(apis).map(([controller, methods]) => (
              <SurferItem
                key={controller}
                controller={controller}
                methods={methods}
              />
            ))}
        </div>
        <div className="aside_surfer_scorll"></div>
      </div>
    </div>
  );
};

export default SurferList;
