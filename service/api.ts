import {
  AUTH_BROWSER_AGENT_KEY,
  AUTH_TOKEN_KEY,
  AUTHENTICATED_KEY,
} from "@/app/middleware";
import axios from "axios";
import { getApiUrl } from "@/service/env";
import { cookieOptions, cookies } from "@/service/cookie";
import { googleLogout } from "@react-oauth/google";


export const apiBaseUrl = getApiUrl();

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const interceptors: {
  RequestSuccess: Parameters<typeof axios.interceptors.request.use>[0];
  RequestError: Parameters<typeof axios.interceptors.request.use>[1];
  ResponseSuccess: Parameters<typeof axios.interceptors.response.use>[0];
  ResponseError: Parameters<typeof axios.interceptors.response.use>[1];
} = {
  RequestSuccess: async (config) => {
    const browserAgent = cookies.get(AUTH_BROWSER_AGENT_KEY);
    if (browserAgent) {
      config.headers["Browser-Agent"] = browserAgent;
    }
    const token = cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  RequestError: (error) => Promise.reject(error),
  ResponseSuccess: (res) => res,
  ResponseError: (error) => {
    const { status, data } = error.response || {};
    if (!status) {
      return Promise.reject(error);
    }
    switch (status) {
      case 201:
      case 204:
        break;
      case 401:
        if (["browser_agent", "invalid_token"].includes(data?.code)) {
          if (data?.code === "browser_agent") {
            cookies.remove(AUTH_BROWSER_AGENT_KEY, cookieOptions);
          }
          cookies.remove(AUTHENTICATED_KEY, cookieOptions);
          cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
          sessionStorage?.removeItem("user");
          googleLogout();
          window.location.reload();
        }
        return Promise.reject(error);
      default:
        return Promise.reject(error);
    }
  },
};

api.interceptors.request.use(
  interceptors.RequestSuccess,
  interceptors.RequestError
);

api.interceptors.response.use(
  interceptors.ResponseSuccess,
  interceptors.ResponseError
);

export { api };
