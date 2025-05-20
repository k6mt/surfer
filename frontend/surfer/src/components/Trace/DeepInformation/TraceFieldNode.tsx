import TraceTreeNode from "@components/Trace/DeepInformation/TraceTreeNode";

interface FieldNodeProps {
  field: any;
}
const TraceFieldNode: React.FC<FieldNodeProps> = ({ field }) => {
  console.log(field);
  if (field === null || field === undefined) {
    return <div className="field-node-null">null</div>;
  }
  if (typeof field !== "object") {
    return;
  }
  const entries = Array.isArray(field)
    ? field.map((v, i) => [i, v])
    : Object.entries(field);

  return (
    <>
      {entries.map(([key, value]) => (
        <TraceTreeNode
          key={key}
          name={key}
          label={Array.isArray(field) ? `${value}` : `${value}`}
          hasChildren={
            typeof value === "object" &&
            value !== null &&
            Object.keys(value).length > 0
          }
        >
          <TraceFieldNode field={value} />
        </TraceTreeNode>
      ))}
    </>
  );
};

export default TraceFieldNode;
