interface SurferItemProps {
  controller?: string | null;
  method: string | null;
  url: string | null;
}

const SurferItem: React.FC<SurferItemProps & { onClick: () => void }> = ({
  url,
  method,
  onClick,
}) => {
  const safeMethod = method ?? "UNKNOWN";
  const safeUrl = url ?? "No URL";

  return (
    <div
      className={`surfer-item-box ${safeMethod.toLocaleLowerCase()}`}
      onClick={onClick}
    >
      <div className="method">{safeMethod}</div>
      <div className="url">{safeUrl}</div>
    </div>
  );
};

export default SurferItem;
