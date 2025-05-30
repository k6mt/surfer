import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const isDev = import.meta.env.MODE === "development";

export const API = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: isDev ? "/api" : "",
});

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error: AxiosError) => {
    console.error("API Request error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log({ ...response });
    return response;
  },
  async (error: AxiosError) => {
    console.log(error.config?.url + " API response error", {
      response_data: error.response?.data,
      status: error.response?.status,
      request_info: {
        method: error.config?.method,
        url: error.config?.url,
        baseUrl: error.config?.baseURL,
        headers: error.config?.headers,
        params: error.config?.params,
        data: error.config?.data,
      },
    });

    return error.response;
  }
);
