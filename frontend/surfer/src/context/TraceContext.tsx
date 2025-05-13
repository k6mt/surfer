import { createContext, useState } from "react";

interface ContextType {
  apis: any;
  loading: boolean;
  error: any;
  refetch: () => void;
  activeItem: any | null;
  setActiveItem: (api: any | null) => void;
}

export const TraceContext = createContext<ContextType | null>(null);
