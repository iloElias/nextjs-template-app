import { AUTH_BROWSER_AGENT_KEY } from "@/proxy";
import { api } from "@/service/api";
import { cookieOptions, cookies } from "@/service/cookie";

export const ensureFingerprint = async (): Promise<void> => {
  const existing = cookies.get(AUTH_BROWSER_AGENT_KEY);
  if (existing) return;

  const response = await api.get<string>("/auth/fingerprint");
  if (response.status === 201 && typeof response.data === "string") {
    cookies.set(AUTH_BROWSER_AGENT_KEY, response.data, cookieOptions);
  }
};
