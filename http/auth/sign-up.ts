import { api } from "@/service/api";
import { AuthResponse } from "./sign-in";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  terms_and_privacy_agreement: boolean;
}

export const signUp = (data: SignUpPayload) => {
  return api.post<AuthResponse>("/auth/sign-up", data);
};
