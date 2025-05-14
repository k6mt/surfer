import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface Nav {
  to: string;
  label: string;
}

export interface AsideNav {
  to: string;
  label: string;
  icon?: IconDefinition;
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  hasError: boolean;
}

export interface TimePoint {
  x: Date;
  y: number;
}

export interface Tab {
  id: string;
  method: string;
  url: string;
  response?: any;
  isLoading: boolean;
}

export interface TabModel {
  id: string;
  controller: string;
  method: string;
  url: string;
  response?: any | null;
  body?: any | null;
  isLoading: boolean;
}

export interface TabProps {
  tab: Tab;
  onFieldChange: (
    tabId: string,
    field: "method" | "url" | "response",
    value: string
  ) => void;
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
