import { ReactNode } from "react";

const ResponseView = ({
  data,
  placeholder,
}: {
  data: any;
  placeholder?: ReactNode;
}) => {
  if (!data) return <div className="trace-tree-placeholder">{placeholder}</div>;

  return <>{JSON.stringify(data, null, 2)}</>;
};

export default ResponseView;
