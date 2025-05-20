const InfoCard = ({ title, data }: { title: string; data: string | undefined }) => {
  return (
    <div className="trace-infos-card">
      <div className="card-title">{title}</div>
      <div className="card-data">{data}</div>
    </div>
  );
};

export default InfoCard;
