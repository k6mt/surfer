const SurferMethodItem = ({ method, url }: { method: any; url: any }) => {
  return (
    <div className="method-item-box">
      <div className={`method ${method.toLowerCase()}`}>{method}</div>
      <div className="url">
        <p>{url}</p>
      </div>
    </div>
  );
};

export default SurferMethodItem;
