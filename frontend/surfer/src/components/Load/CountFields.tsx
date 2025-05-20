import { LoadField } from "@_types/shared";
import React, { useEffect, useState } from "react";

const CountFields = ({
  field,
  index,
  handleInputChange,
}: {
  field: LoadField;
  index: number;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => void;
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const validateFn = field.validate(field.value);
    setHasError(!validateFn);
  }, [field.value]);

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={field.name}>
        {field.label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type} // "text" | "number"
        value={field.value}
        onChange={(e) => handleInputChange(e, index)}
        className="form-input"
        required
      />
      {hasError && <div className="form-error">Invalid {field.label}</div>}
    </div>
  );
};

export default CountFields;
