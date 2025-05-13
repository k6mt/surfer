import { useState } from "react";
import SurferMethodList from "./SurferMethodList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface SurferItemProps {
  controller: any | string | null;
  methods: any | null;
}

const SurferItem: React.FC<SurferItemProps> = ({ controller, methods }) => {
  const [showMethods, setShowMethods] = useState(false);

  return (
    <div
      className="surfer-item-box"
      onClick={() => setShowMethods((prev) => !prev)}
    >
      <div className="controller-box">
        <div className="controller">{controller}</div>
        <div className={`dropdown-icon ${showMethods ? "open" : ""}`}>
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </div>

      <div className={`method-list ${showMethods ? "visible" : ""}`}>
        <SurferMethodList methods={methods} />
      </div>
    </div>
  );
};

export default SurferItem;
