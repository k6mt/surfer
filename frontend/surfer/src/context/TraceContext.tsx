import { Trace } from "@context/TraceContextProvider";
import { createContext } from "react";

export const TraceContext = createContext<Trace | undefined>(undefined);
