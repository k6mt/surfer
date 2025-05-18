import { LoadField } from "@_types/shared";

// Validation 함수들
const validateThreadCount = (value: string) => parseInt(value, 10) > 0;
const validateRequestPerSecond = (value: string) =>
  parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100;
const validateDurationSeconds = (value: string) => parseInt(value, 10) > 0;

// 필드를 생성하는 함수 (기본값만 생성)
const generateField = (
  name: string,
  label: string,
  type: "text" | "select" | "textarea" | "number",
  value: string,
  validate: (value: string) => boolean
): LoadField => ({
  name,
  label,
  type,
  value,
  validate,
});

export default function generateDefaultField(): LoadField[] {
  return [
    generateField("threadCount", "Thread Count", "number", "10", validateThreadCount),
    generateField(
      "requestPerSecond",
      "Requests Per Second",
      "number",
      "5",
      validateRequestPerSecond
    ),
    generateField("durationSeconds", "Duration (seconds)", "number", "60", validateDurationSeconds),
  ];
}
