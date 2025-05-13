import SurferMethodItem from "./SurferMethodItem";

const SurferMethodList = ({ methods }: { methods: any }) => {
  return (
    <div className="method">
      <div className="method-inner">
        {methods.map((item: any) => (
          <SurferMethodItem method={item.method} url={item.url} />
        ))}
      </div>
    </div>
  );
};

export default SurferMethodList;
