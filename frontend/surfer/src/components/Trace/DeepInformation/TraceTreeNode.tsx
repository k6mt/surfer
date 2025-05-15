import { ReactNode, useState } from "react";

interface TreeNodeProps {
  label: string;
  defaultOpen?: boolean;
  hasChildren?: boolean;
  isRoot?: boolean;
  children?: ReactNode;
}

const TraceTreeNode: React.FC<TreeNodeProps> = ({
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
        {hasChildren && <span className="tree-node-icon">{open ? "▾" : "▸"}</span>}
        <span>{label}</span>
      </div>
      {open && <div className="tree-node-children">{children}</div>}
    </div>
  );
};

export default TraceTreeNode;
