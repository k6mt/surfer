import { Field } from "@_types/shared";
import { useLoadTest } from "@hooks/useLoadTest";
import { useMemo } from "react";

const validateUrl = (value: string) => value.trim() !== ""; // Check if URL is not empty

const validateThreadCount = (value: string) => parseInt(value, 10) > 0; // Check if thread count is a positive number

const validateRequestPerSecond = (value: string) =>
  parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100; // Check if requests per second is between 1 and 100

const validateDurationSeconds = (value: string) => parseInt(value, 10) > 0; // Check if duration is a positive number

const validateBody = (value: string) => value.trim() !== ""; // Validate body (textarea)

export function useLoadTestFields(): Field[] {
  const url: Field = {
    name: "url",
    label: "Target URL",
    type: "text",
    state: useLoadTest("", validateUrl),
  };

  const method: Field = {
    name: "method",
    label: "HTTP Method",
    type: "select",
    options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    state: useLoadTest("GET", (value) =>
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value)
    ),
  };

  const body: Field = {
    name: "body",
    label: "Request Body (JSON)",
    type: "textarea",
    state: useLoadTest(`{"key":"value"}`, validateBody),
  };

  const threadCount: Field = {
    name: "threadCount",
    label: "Thread Count",
    type: "number",
    state: useLoadTest("10", validateThreadCount),
  };

  const requestPerSecond: Field = {
    name: "requestPerSecond",
    label: "Requests Per Second",
    type: "number",
    state: useLoadTest("5", validateRequestPerSecond),
  };

  const durationSeconds: Field = {
    name: "durationSeconds",
    label: "Duration (seconds)",
    type: "number",
    state: useLoadTest("60", validateDurationSeconds),
  };

  return useMemo(
    () => [url, method, body, threadCount, requestPerSecond, durationSeconds],
    [url, method, body, threadCount, requestPerSecond, durationSeconds]
  );
}
