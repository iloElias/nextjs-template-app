import { api } from "@/service/api";
import { AuthResponse } from "./sign-in";

export const googleAuthV2 = (accessToken: string) => {
  return api.post<AuthResponse>("/auth/google-auth/v2", {
    access_token: accessToken,
  });
};
