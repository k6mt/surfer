import { API } from "@apis/axios";

import { useState } from "react";

export function useScan<T = any>() {
  const [apis, setApis] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  function isObject(value: any) {
    return value !== null && typeof value === "object";
  }

  async function ApiScan() {
    try {
      setLoading(true);
      const response = await API.get("/scan/list");
      if (response.status === 200) {
        //Check null or non-length array
        if (!response.data || !isObject(response.data)) {
          setApis(null);
        } else {
          setApis(response.data);
        }
      } else {
        setError(response);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function ApiScanByMethod(method: any, url: any) {
    try {
      setLoading(true);
      const response = await API.get("/scan", {
        params: {
          methodType: method,
          encodeUrl: url,
        },
      });

      if (response.status === 200) {
        console.log(response.data, "SCAN");
        return response.data;
      }
    } catch (error) {
      setError(error);
    }
  }

  return { apis, ApiScan, ApiScanByMethod, loading, error };
}
