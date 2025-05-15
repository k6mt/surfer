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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
  response: any | null;
  params: any | null;
  trace: any | null;
  isLoading: boolean;
  config: any | null;
}

export interface TabProps {
  tab: Tab;
  onFieldChange: (tabId: string, field: "method" | "url" | "response", value: string) => void;
}

export interface TracedParams {
  root: "RequestParam" | "PathVariable" | "RequestHeader" | "RequestBody";
  type?: string;
  name?: string;
  fields?: TracedParams[];
  element?: TraceParams;
  keyType?: TracedParams;
  value?: TracedParams;
}

export interface PathVariableParam {
  name: string;
  type: string;
}

export interface RequestBody {
  name: string;
  type: string;
  fields: CommonField[];
  element: ListElement;
  keyType: { type: string };
  value: CommonField;
}

export interface CommonField {
  name?: string;
  type: string;
  fields?: CommonField[];
  element?: CommonField;
  keyType?: { type: string };
  value?: CommonField;
}

export interface ListElement {
  type: string;
  name: string;
  fields: CommonField[];
  element: ListElement;
}

export interface MapType {
  keyType: { type: string };
  name: string;
  type: string;
  value: CommonField;
}

export type RawParams = Record<
  string,
  { name: string; type: string; fields?: any; element?: any }[]
>;

export interface TraceRecord {
  traceId: string;
  depth: number;
  className: string;
  methodName: string;
  startTimeMs: number;
  endTimeMs: number;
  resultTimeMs: number;
  parameters: any[];
  returnValue: any;
  nextTraces: TraceRecord[];
}
