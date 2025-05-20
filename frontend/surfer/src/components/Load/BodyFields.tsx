import { LoadField } from "@_types/shared";
import React, { useEffect, useState } from "react";

const BodyFields = ({
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
    <div className="textarea-container">
      <label className="textarea-label">{field.label}</label>
      <textarea
        name={field.name}
        value={field.value}
        onChange={(e) => handleInputChange(e, index)}
        className="textarea-field"
        placeholder="여기에 JSON을 입력하세요"
      />
      {hasError && <div className="form-error">Invalid {field.label}</div>}
    </div>
  );
};

export default BodyFields;
