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
  async function TraceAPI({
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

    try {
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

      // trace => GET + params
      const traceRequest = API.get("/trace", {
        headers,
        params: {
          url,
          method,
        },
      });

      const [response, trace] = await Promise.all([apiRequest, traceRequest]);

      return { response, trace };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return { TraceAPI };
}
