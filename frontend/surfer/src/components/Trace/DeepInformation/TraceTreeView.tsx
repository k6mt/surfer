import { TraceRecord } from "@_types/shared";
import TraceFieldNode from "@components/Trace/DeepInformation/TraceFieldNode";
import TraceTreeNode from "@components/Trace/DeepInformation/TraceTreeNode";
import { ReactNode } from "react";

interface TraceTreeViewProps {
  data: TraceRecord | TraceRecord[];
  placeholder?: ReactNode;
}

const TraceTreeView: React.FC<TraceTreeViewProps> = ({ data, placeholder }) => {
  // No data until user triggers
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div className="trace-tree-placeholder">{placeholder}</div>;
  }

  const traces = Array.isArray(data) ? data : [data];

  return (
    <div className="trace-tree">
      {traces.map((trace, idx) => (
        <TraceTreeNode
          key={`${trace.traceId}-${trace.depth}-${idx}`}
          label={`${trace.className}.${trace.methodName} (${trace.resultTimeMs}ms)`}
          defaultOpen={trace.depth === 0}
          hasChildren={
            (trace.parameters && trace.parameters.length > 0) ||
            (trace.nextTraces && trace.nextTraces.length > 0)
          }
          isRoot={trace.depth === 0}
        >
          {/* Render parameters if exist */}
          {trace.parameters?.length > 0 && (
            <div>
              {trace.parameters.map((param, i) => (
                <TraceFieldNode key={`param-${trace.depth}-${i}`} field={param} />
              ))}
            </div>
          )}

          {/* Recursively render child traces */}
          {trace.returnValue !== undefined && <TraceFieldNode field={trace.returnValue} />}

          {trace.nextTraces?.length > 0 && <TraceTreeView data={trace.nextTraces} />}
        </TraceTreeNode>
      ))}
    </div>
  );
};

export default TraceTreeView;
