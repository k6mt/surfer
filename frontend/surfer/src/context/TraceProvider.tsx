import { TraceContext } from "@context/TraceContext";
import { useScan } from "@hooks/useScan";
import { useEffect, ReactNode, useState } from "react";

export const TraceContextProvider = ({ children }: { children: ReactNode }) => {
  const { apis, loading, error, ApiScan } = useScan();

  useEffect(() => {
    ApiScan();
  }, []);

  const [activeItem, setActiveItem] = useState<any | null>(null);

  return (
    <TraceContext.Provider
      value={{
        apis,
        loading,
        error,
        refetch: ApiScan,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </TraceContext.Provider>
  );
};
