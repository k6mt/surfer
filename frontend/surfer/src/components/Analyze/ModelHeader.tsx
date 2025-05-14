import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useTabModelsContext } from "@hooks/useTabModels";

const ModelHeader = () => {
  const { tabModels, activeTabModel, setActiveTabModel, removeTabModel } =
    useTabModelsContext();

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const scrollLeftBeforeRemove = useRef(0);
  const SCROLL_AMOUNT = 150; // Move px amount when click button

  const [isTabsDragging, setIsTabsDragging] = useState(false);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isTabsDragging || !tabsRef.current) return;
    tabsRef.current?.classList.add("drag");
    tabsRef.current.scrollLeft -= event.movementX;
  };

  const handleMouseDown = () => {
    if (tabsRef.current) {
      setIsTabsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (tabsRef.current) {
      tabsRef.current.classList.remove("drag");
      setIsTabsDragging(false);
    }
  };

  const handleRemoveTab = (id: string) => {
    if (tabsRef.current) {
      scrollLeftBeforeRemove.current = tabsRef.current.scrollLeft;
    }
    removeTabModel(id);
  };

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    }
  };

  //Long Press button
  const startButtonLongPress = (direction: "left" | "right") => {
    if (!tabsRef.current) return;
    const amount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT; //direction
    scrollInterval.current = setInterval(() => {
      tabsRef.current?.scrollBy({ left: amount, behavior: "smooth" });
    }, 200);
  };

  const stopButtonLongPress = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  useEffect(() => {
    if (!tabsRef.current) {
      return;
    }

    tabsRef.current.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      tabsRef.current?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTabsDragging]);

  //activeTab auto scroll
  useEffect(() => {
    if (!tabsRef.current || !activeTabModel) return;

    const timeout = setTimeout(() => {
      const activeTabElement = tabsRef.current?.querySelector(
        `[data-tab-id="${activeTabModel}"]`
      );

      if (activeTabElement instanceof HTMLElement) {
        activeTabElement.scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [activeTabModel, tabModels.length]);

  //remain scroll position when tab remove
  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft = scrollLeftBeforeRemove.current;
    }
  }, [tabModels.length]);

  return (
    <div className="main-header">
      <div
        className="icon icon-left"
        onClick={scrollLeft}
        onMouseDown={() => startButtonLongPress("left")}
        onMouseUp={stopButtonLongPress}
        onMouseLeave={stopButtonLongPress}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>

      <div
        className="main-tabs"
        ref={tabsRef}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        {tabModels.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            className={`main-tab ${activeTabModel === tab.id ? "active" : ""}`}
            onClick={() => setActiveTabModel(tab.id)}
          >
            <span className="tab-method">{tab.method}</span>
            <span className="tab-url" title={tab.url}>
              {tab.url}
            </span>
            <button
              className=" main-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTab(tab.id);
              }}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        ))}
      </div>

      <div
        className="icon icon-right"
        onClick={scrollRight}
        onMouseDown={() => startButtonLongPress("right")}
        onMouseUp={stopButtonLongPress}
        onMouseLeave={stopButtonLongPress}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </div>
  );
};

export default ModelHeader;
