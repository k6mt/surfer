import { LoadTest } from "@_types/shared";
import { useCallback, useState } from "react";

export function useLoadTest(
  defaultValue: string,
  validationFn: (value: string) => boolean
): LoadTest {
  const [value, setValue] = useState<string>(defaultValue);
  const [hasError, setHasError] = useState<boolean>(
    !validationFn(defaultValue)
  );

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setValue(event.target.value);
      setHasError(!validationFn(event.target.value));

      console.log(hasError, event.target.value);
    },
    [validationFn]
  );

  return {
    value,
    hasError,
    handleInputChange,
  };
}
