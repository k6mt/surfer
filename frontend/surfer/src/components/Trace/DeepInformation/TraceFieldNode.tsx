import TraceTreeNode from "@components/Trace/DeepInformation/TraceTreeNode";

interface FieldNodeProps {
  field: any;
}
const TraceFieldNode: React.FC<FieldNodeProps> = ({ field }) => {
  if (field === null || field === undefined) {
    return <div className="field-node-null">null</div>;
  }
  if (typeof field !== "object") {
    return <div>{String(field)}</div>;
  }
  const entries = Array.isArray(field) ? field.map((v, i) => [i, v]) : Object.entries(field);

  return (
    <>
      {entries.map(([key, value]) => (
        <TraceTreeNode
          key={key}
          label={Array.isArray(field) ? `${key}` : `${key}:`}
          hasChildren={typeof value === "object" && value !== null && Object.keys(value).length > 0}
        >
          <TraceFieldNode field={value} />
        </TraceTreeNode>
      ))}
    </>
  );
};

export default TraceFieldNode;
