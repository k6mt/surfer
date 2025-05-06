import { Field } from "@_types/shared";

// interface BodyAreaProps {
//   field: Field;
// }

const BodyArea = ({ field }: { field: Field }) => {
  return (
    <div className="textarea-container">
      <label className="textarea-label">{field.label}</label>
      <textarea
        name={field.name}
        value={field.state.value}
        onChange={field.state.handleInputChange}
        className="textarea-field"
        placeholder="여기에 JSON을 입력하세요"
      />
    </div>
  );
};

export default BodyArea;
