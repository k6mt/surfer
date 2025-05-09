import { useContext } from "react";
import { LoadTestContext } from "@context/LoadTestContext";

export function useLoadTestContext() {
  const context = useContext(LoadTestContext);
  if (!context) {
    throw new Error("useLoadTestContext must be used within LoadTestProvider");
  }
  return context;
}
