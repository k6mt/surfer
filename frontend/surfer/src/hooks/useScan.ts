import { API } from "@apis/axios";
import { useState } from "react";

export function useScan<T = any>() {
  const [apis, setApis] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  async function ApiScan() {
    try {
      setLoading(true);
      const response = await API.get("api/scan/list");
      if (response.status === 200) {
        setApis(response.data);
      } else {
        setError(response);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return { apis, ApiScan, loading, error };
}
