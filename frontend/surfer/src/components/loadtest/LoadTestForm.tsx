import { useLoadTest } from "@hooks/useLoadTest";
import { API } from "@apis/axios";
import MethodSelect from "@components/loadtest/MethodSelect";
import { Field } from "@_types/shared";
import BodyArea from "@components/loadtest/BodyArea";
import CountArea from "@components/loadtest/CountArea";
import { useLoadTestContext } from "@hooks/useLoadTestContext";

export default function LoadTestForm() {
  // Validation functions for each form field
  const validateUrl = (value: string) => value.trim() !== ""; // Check if URL is not empty

  const validateThreadCount = (value: string) => parseInt(value, 10) > 0; // Check if thread count is a positive number

  const validateRequestPerSecond = (value: string) =>
    parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100; // Check if requests per second is between 1 and 100

  const validateDurationSeconds = (value: string) => parseInt(value, 10) > 0; // Check if duration is a positive number

  const validateBody = (value: string) => value.trim() !== ""; // Validate body (textarea)

  let IntervalID: NodeJS.Timeout | null = null; // Declare IntervalID as a number or null

  const { setMetrics, setConfig } = useLoadTestContext(); // Use context to set metrics

  //REACT HOOKS CAN`T USE IN CALLBACK!!
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

  const fields: Field[] = [
    url,
    method,
    body,
    threadCount,
    requestPerSecond,
    durationSeconds,
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Check if any field has an error before submitting
    if (fields.some((field) => field.state.hasError)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    // Prepare form data to send to the server
    const formData = fields.reduce((acc, field, index) => {
      acc[fields[index].name] = field.state.value;
      return acc;
    }, {} as Record<string, string>);

    //Axios
    try {
      const response = await API.post("/load/start", null, {
        params: formData,
      });

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
      const data = response.data;
      console.log("Metrics data:", data);
      setConfig({
        duration: parseInt(durationSeconds.state.value),
      });
      // Update charts with the fetched metrics data
      setMetrics(data);

      // Polling stop
      if (data.isRunning === false && IntervalID) {
        clearInterval(IntervalID); // Clear the interval when the load test is not running
        IntervalID = null; // Reset IntervalID to null
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  return (
    <>
      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="url-container">
          <div className="url-method-row">
            <MethodSelect
              value={method.state.value}
              options={["GET", "POST", "PUT", "PATCH", "DELETE"]}
              onChange={(newValue) =>
                method.state.handleInputChange({
                  target: { value: newValue },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            />

            <div className="divider" />

            <input
              id="url"
              name="url"
              type="text"
              className="form-input"
              value={url.state.value}
              onChange={url.state.handleInputChange}
              required
            />
          </div>
          <button className="url-send-btn" type="submit">
            <div className="url-send-btn-txt">Send</div>
          </button>
        </div>

        <div
          className="form-error"
          style={{
            visibility: url.state.hasError === true ? "visible" : "hidden",
          }}
        >
          Invalid Target URL
        </div>

        <div className="form-data-container">
          <div className="form-data-count">
            <CountArea field={threadCount} />
            <CountArea field={requestPerSecond} />
            <CountArea field={durationSeconds} />
          </div>
          <div className="form-data-body">
            <BodyArea field={body} />
          </div>
        </div>
      </form>
    </>
  );
}
