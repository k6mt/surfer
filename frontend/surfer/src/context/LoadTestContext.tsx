import { createContext } from "react";
import type { LoadTestContextProps } from "./LoadTestContextProvider";

export const LoadTestContext = createContext<LoadTestContextProps | undefined>(
  undefined
);
