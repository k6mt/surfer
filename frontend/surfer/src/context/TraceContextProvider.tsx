import { TraceContext } from "@context/TraceContext";
import { ReactNode, useState } from "react";

export interface TraceContextProps {
  method: string;
  url: string;
}

export interface Trace {
  data: any[];
  setData: (m: any) => void;
}

export function TraceContextProvider({ children }: { children: ReactNode }) {
  const [trace, setTrace] = useState<any[]>([]);

  return (
    <TraceContext.Provider value={{ data: trace, setData: setTrace }}>
      {children}
    </TraceContext.Provider>
  );
}
