import { useLoadTest } from "../hooks/useLoadTest";
import { API } from "../apis/axios";

function DashBoard() {
  // Validation functions for each form field
  const validateUrl = (value: string) => value.trim() !== ""; // Check if URL is not empty

  const validateThreadCount = (value: string) => parseInt(value, 10) > 0; // Check if thread count is a positive number

  const validateRequestPerSecond = (value: string) =>
    parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100; // Check if requests per second is between 1 and 100

  const validateDurationSeconds = (value: string) => parseInt(value, 10) > 0; // Check if duration is a positive number

  const fields = [
    {
      name: "url",
      value: "",
      validationFn: validateUrl,
      label: "Target URL",
      type: "text",
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

  const formState = fields.map((field) => {
    if (field.name === "url") {
      field.value = encodeURI(field.value);
    }
    return useLoadTest(field.value, field.validationFn);
  });

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
        headers: {
          "Content-Type": "application/json",
        },
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
  }

  return (
    <div>
      <h1>Load Test</h1>
      <form id="loadForm" onSubmit={handleSubmit}>
        {fields.map((field, index) => {
          const { value, handleInputChange, hasError } = formState[index];
          return (
            <div key={field.name}>
              <label>
                {field.label}:
                <input
                  type={field.type}
                  name={field.name}
                  value={value}
                  onChange={handleInputChange}
                  required
                />
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

export default DashBoard;
