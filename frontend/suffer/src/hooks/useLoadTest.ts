import { useState } from "react";

export function useLoadTest(
  defaultValue: string,
  validationFn: (value: string) => boolean
) {
  const [value, setValue] = useState<string>(defaultValue);
  const valueIsValid = validationFn(value);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return {
    value,
    handleInputChange,
    hasError: !valueIsValid,
  };
}
