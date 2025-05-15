import { TracedParams } from "@_types/shared";
import { useState } from "react";

const InfoParamTree = ({
  data,
  depth = 0,
}: {
  data: TracedParams;
  depth?: number;
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = data?.fields || data?.element;

  const rows = [
    <tr key={data.root + data.name}>
      <td style={{ paddingLeft: `${depth * 20}px` }}>
        {hasChildren && (
          <button onClick={() => setOpen(!open)}>{open ? "-" : "+"}</button>
        )}
        {data.root}
      </td>
      <td>{data.type}</td>
    </tr>,
  ];

  if (open && data.fields) {
    rows.push(
      ...data.fields.map((child) => (
        <InfoParamTree key={child.name} data={child} depth={depth + 1} />
      ))
    );
  } else if (open && data.element) {
    rows.push(
      <InfoParamTree
        key={data.name + "-element"}
        data={data.element}
        depth={depth + 1}
      />
    );
  }

  return <>{rows}</>;
};

export default InfoParamTree;
