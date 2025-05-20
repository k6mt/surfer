interface ApiBoxProps {
  method: string | null;
  url: string | null;
}

const ApiBox: React.FC<ApiBoxProps & { onClick: () => void }> = ({
  method,
  url,
  onClick,
}) => {
  const safeMethod = method ?? "UNKNOWN";
  const safeUrl = url ?? "No URL";

  return (
    <div className="api-box" onClick={onClick}>
      <div className={`api-box-method ${safeMethod.toLowerCase()}`}>
        {safeMethod}
      </div>
      <div className="api-box-url"> {safeUrl}</div>
    </div>
  );
};

export default ApiBox;
