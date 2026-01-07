import { isEmpty } from "@/lib/utils";

export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

export const isIpAddress = (hostname: string) => {
  return /^[0-9.]+$/.test(hostname);
};

export const getCurrentOrigin = (): string => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  }
  return "http://localhost:3000";
};

export const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (isEmpty(envUrl)) {
    throw new Error("No defined env api base url in: PUBLIC_API_BASE_URL")
  }

  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  return isIpAddress(hostname)
    ? `${getCurrentOrigin().replace(/:3030$/, "")}`
    : envUrl;
};
