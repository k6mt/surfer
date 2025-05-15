import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const TreeNode: React.FC<{
  label: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  hasChildren?: boolean;
  isRoot: boolean;
}> = ({
  label,
  children,
  defaultOpen = false,
  hasChildren = true,
  isRoot = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="tree-node">
      <div
        className="tree-label"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {hasChildren ? (
          open ? (
            <div className="icon-wrap">
              <FontAwesomeIcon icon={faAngleDown} className="icon" />
            </div>
          ) : (
            <div className="icon-wrap">
              <FontAwesomeIcon icon={faAngleRight} className="icon" />
            </div>
          )
        ) : (
          " "
        )}
        {isRoot ? `@${label}` : `${label}`}
      </div>
      {open && (
        <div className="tree-children" style={{ paddingLeft: 15 }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
