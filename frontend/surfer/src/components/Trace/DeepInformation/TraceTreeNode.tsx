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
  const [exception, setException] = useState(null);

  const tooltipContent =
    `Parameters: ${JSON.stringify(node.parameters, null, 2)}\n` +
    `Return Value: ${JSON.stringify(node.returnValue, null, 2)}\n` +
    `ExecutionTime: ${node.resultTimeMs} ms\n` +
    `Time: ${new Date(node.startTimeMs).toLocaleTimeString()}\n` +
    `Call Depth: ${node.depth}\n`;

  const ErrorTooltip = `Exception: ${node.exceptionMessage}`;

  useEffect(() => {
    if (node.exceptionMessage === undefined || node.exceptionMessage === null) {
      setException(null);
      return;
    } else {
      setException(node.exceptionMessage);
      return;
    }
  }, [node.exceptionMessage]);

  const formatErrorMessage = (msg: string): string => {
    if (!msg) return "";

    return msg
      .replace(/(Exception|Error)/g, "\n$1") // Add line break before keywords like Exception or Error
      .replace(/(at\s+[a-zA-Z0-9_.]+\([^)]+\))/g, "\n  $1") // Add line break and indent for stack trace entries
      .replace(/\b(could not|duplicate|constraint|SQL|Caused by)\b/gi, "\n$&") // Add line break before common SQL error phrases
      .replace(/;/g, ";\n") // Add line break after semicolons
      .replace(/\n{2,}/g, "\n") // Remove excessive blank lines
      .trim();
  };

  return (
    <div className={`tree-node ${isRoot ? "indent" : ""}`}>
      <div
        className={`tree-node-label ${!exception ? "" : "exception"}`}
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
        <div className="tooltip">
          <pre>
            {exception ? formatErrorMessage(ErrorTooltip) : tooltipContent}
          </pre>
        </div>
      </div>
      {open && <div className="tree-node-children">{children}</div>}
    </div>
  );
};

export default TraceTreeNode;
