export interface Nav {
  to: string;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea"; // 'text', 'number', or 'select'
  options?: string[]; // options for select type
  state: LoadTest;
}

export interface LoadTest {
  value: string;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  hasError: boolean;
}
/*
const fields: Field[] = [
  {
    name: "url",
    value: "",
    validationFn: validateUrl,
    label: "Target URL",
    type: "text",
  },
  {
    name: "method",
    value: "GET",
    validationFn: (value: string) => ["GET", "POST", "PUT", "DELETE"].includes(value),
    label: "HTTP Method",
    type: "select",
    options: ["GET", "POST", "PUT", "DELETE"], // select 요소 옵션
  },
  {
    name: "body",
    value: '{"key":"value"}',
    validationFn: validateBody,
    label: "Request Body (JSON, POST/PUT only)",
    type: "textarea",
  },
  {
    name: "threadCount",
    value: "10",
    validationFn: validateThreadCount,
    label: "Thread Count",
    type: "number",
  },
  {
    name: "requestPerSecond",
    value: "5",
    validationFn: validateRequestPerSecond,
    label: "Requests Per Second (per thread)",
    type: "number",
  },
  {
    name: "durationSeconds",
    value: "60",
    validationFn: validateDurationSeconds,
    label: "Duration (seconds)",
    type: "number",
  },
];
*/
