import { ReactNode } from "react";

const ResponseView = ({
  data,
  placeholder,
}: {
  data: any;
  placeholder?: ReactNode;
}) => {
  console.log(data);
  if (!data) return <div className="trace-tree-placeholder">{placeholder}</div>;

  return <pre id="json">{JSON.stringify(data, null, 2)}</pre>;
};

export default ResponseView;
