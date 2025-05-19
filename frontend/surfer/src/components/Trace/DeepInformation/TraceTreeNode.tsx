import {
  faFolder,
  faFolderClosed,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useState } from "react";

interface TreeNodeProps {
  name?: string;
  label: string;
  node?: any;
  defaultOpen?: boolean;
  hasChildren?: boolean;
  isRoot?: boolean;
  children?: ReactNode;
}

const TraceTreeNode: React.FC<TreeNodeProps> = ({
  name,
  label,
  node,
  defaultOpen = false,
  hasChildren = false,
  isRoot = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [execption, setException] = useState(null);

  const tooltipContent =
    `Parameters: ${JSON.stringify(node.parameters)}\n` +
    `Return Value: ${JSON.stringify(node.returnValue)}\n` +
    `ExecutionTime: ${node.resultTimeMs} ms\n` +
    `Time: ${new Date(node.startTimeMs).toLocaleTimeString()}\n` +
    `Call Depth: ${node.depth}\n` +
    `Exception: ${node.exceptionMessage}`;

  useEffect(() => {
    if (node.exceptionMessage === undefined || node.exceptionMessage === null) {
      setException(null);
      return;
    } else {
      setException(node.exceptionMessage);
      return;
    }
  }, [node.exceptionMessage]);

  return (
    <div className={`tree-node ${isRoot ? "indent" : ""}`}>
      <div
        className={`tree-node-label ${!execption ? "" : "execption"}`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && (
          <span className="tree-node-icon">
            {open ? (
              <FontAwesomeIcon icon={faFolderOpen} />
            ) : (
              <FontAwesomeIcon icon={faFolder} />
            )}
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

        <div className="tooltip">{tooltipContent}</div>
      </div>
      {open && <div className="tree-node-children">{children}</div>}
    </div>
  );
};

export default TraceTreeNode;
