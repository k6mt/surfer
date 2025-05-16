import { Field } from "@_types/shared";

const CountArea = ({ field }: { field: Field }) => {
  const { value, handleInputChange, hasError } = field.state;
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={field.name}>
        {field.label} {value}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type} // "text" | "number"
        value={value}
        onChange={(e) => {
          handleInputChange(e);
          console.log(e.target.value);
        }}
        className="form-input"
        required
      />
      {hasError && <div className="form-error">Invalid {field.label}</div>}
    </div>
  );
};

export default CountArea;
