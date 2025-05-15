import { faFolder, faFolderClosed, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";

interface TreeNodeProps {
  name?: string;
  label: string;
  defaultOpen?: boolean;
  hasChildren?: boolean;
  isRoot?: boolean;
  children?: ReactNode;
}

const TraceTreeNode: React.FC<TreeNodeProps> = ({
  name,
  label,
  defaultOpen = false,
  hasChildren = false,
  isRoot = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`tree-node ${isRoot ? "indent" : ""}`}>
      <div className="tree-node-label" onClick={() => hasChildren && setOpen(!open)}>
        {hasChildren && (
          <span className="tree-node-icon">
            {open ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
          </span>
        )}
        {!hasChildren && (
          <span className="tree-node-icon">
            <FontAwesomeIcon icon={faFolderClosed} color="#ffffff" />
          </span>
        )}
        <span>
          {name} {label}
        </span>
      </div>
      {open && <div className="tree-node-children">{children}</div>}
    </div>
  );
};

export default TraceTreeNode;
