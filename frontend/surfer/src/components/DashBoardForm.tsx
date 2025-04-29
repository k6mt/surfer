import React from "react";
import { useLoadTest } from "@hooks/useLoadTest";
import { API } from "@apis/axios";

export default function DashBoardForm() {
  interface Field {
    name: string;
    value: string;
    validationFn: (value: string) => boolean; // validation function return type is boolean
    label: string;
    type: "text" | "number" | "select" | "textarea"; // 'text', 'number', or 'select'
    options?: string[]; // options for select type
  }

  // Validation functions for each form field
  const validateUrl = (value: string) => value.trim() !== ""; // Check if URL is not empty

  const validateThreadCount = (value: string) => parseInt(value, 10) > 0; // Check if thread count is a positive number

  const validateRequestPerSecond = (value: string) =>
    parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100; // Check if requests per second is between 1 and 100

  const validateDurationSeconds = (value: string) => parseInt(value, 10) > 0; // Check if duration is a positive number

  const validateBody = (value: string) => value.trim() !== ""; // Validate body (textarea)

  let IntervalID: NodeJS.Timeout | null = null; // Declare IntervalID as a number or null

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
      validationFn: (value: string) =>
        ["GET", "POST", "PUT", "DELETE"].includes(value),
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

  const formState = fields.map((field) =>
    useLoadTest(field.value, field.validationFn)
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Check if any field has an error before submitting
    if (formState.some((field) => field.hasError)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    // Prepare form data to send to the server
    const formData = formState.reduce((acc, field, index) => {
      acc[fields[index].name] = field.value;
      return acc;
    }, {} as Record<string, string>);

    //Axios
    try {
      const response = await API.post("/load/start", null, {
        params: formData,
      });

      console.log(response);

      if (response.status === 200) {
        console.log("Load test started successfully:", response.data);
      } else {
        console.error("Failed to start load test:", response.data);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred");
    }

    if (IntervalID) {
      clearInterval(IntervalID); // Clear any existing interval before starting a new one
    }

    IntervalID = setInterval(fetchMetricsAndUpdateCharts, 1000); // Fetch metrics every second
  }

  async function fetchMetricsAndUpdateCharts() {
    try {
      const response = await API.get("/load/metrics");
      console.log("Metrics data:", response.data);
      // Update charts with the fetched metrics data
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  return (
    <div>
      <form id="loadForm" onSubmit={handleSubmit}>
        {fields.map((field, index) => {
          const { value, handleInputChange, hasError } = formState[index];

          let inputElement: React.JSX.Element | null = null; // Initialize inputElement as null

          switch (field.type) {
            case "select":
              inputElement = (
                <select
                  name={field.name}
                  value={value}
                  onChange={handleInputChange}
                  required
                >
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
              break;

            case "textarea":
              inputElement = (
                <textarea
                  name={field.name}
                  value={value}
                  onChange={handleInputChange}
                  required
                />
              );
              break;

            default:
              inputElement = (
                <input
                  type={field.type}
                  name={field.name}
                  value={value}
                  onChange={handleInputChange}
                  required
                />
              );
              break;
          }
          return (
            <div key={field.name}>
              <label>
                {field.label}:{inputElement}
                {hasError && (
                  <span style={{ color: "red" }}>Invalid {field.label}</span>
                )}
              </label>
              <br />
              <br />
            </div>
          );
        })}
        <button type="submit">Start Load Test</button>
      </form>
    </div>
  );
}
