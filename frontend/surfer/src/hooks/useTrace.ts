import { API } from "@apis/axios";
import { AxiosRequestConfig } from "axios";

interface TraceAPIOptions {
  method: "get" | "post" | "put" | "delete";
  url: string;
  id: string; // X-Surfer-Header
  pathVariables?: Record<string, string | number>; // @PathVariable
  params?: Record<string, any>; // @RequestParam
  data?: any; // @RequestBody
}

export function useTrace() {
  async function requestWithHeader({
    method,
    url,
    id,
    pathVariables,
    params,
    data,
  }: TraceAPIOptions) {
    const headers = {
      "X-Surfer-Header": id,
    };

    // pathVariables URL
    let finalUrl = url;
    if (pathVariables) {
      for (const [key, value] of Object.entries(pathVariables)) {
        console.log(key, value);
        finalUrl = finalUrl.replace(
          `{${key}}`,
          encodeURIComponent(String(value))
        );
      }
    }

    // config 구성
    const config: AxiosRequestConfig = {
      headers,
      params,
    };

    // method case
    const apiRequest = (() => {
      switch (method) {
        case "get":
          return API.get(finalUrl, config);
        case "delete":
          return API.delete(finalUrl, config);
        case "post":
          return API.post(finalUrl, data, config);
        case "put":
          return API.put(finalUrl, data, config);
        default:
          throw new Error("Invalid HTTP method");
      }
    })();

    const response = await apiRequest;

    return response;
  }

  async function TraceAPI({ method, url, id }: TraceAPIOptions) {
    const headers = {
      "X-Surfer-Header": id,
    };

    try {
      // trace => GET + params
      const traceRequest = API.get("/trace", {
        headers,
        params: {
          url,
          method,
        },
      });

      const trace = await traceRequest;

      return trace;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function AnanlyzeMethod(id: string) {
    const headers = {
      "X-Surfer-Header": id,
    };

    const config: AxiosRequestConfig = {
      headers,
      timeout: 300000000,
    };

    //Analyze Method
    const analyzMethodRequest = API.get("/method-analysis", config);

    const analysis = await analyzMethodRequest;

    return analysis;
  }

  return { TraceAPI, requestWithHeader, AnanlyzeMethod };
}
