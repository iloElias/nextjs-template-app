import { api } from "@/service/api";
import { User } from "@/types/user";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export const signIn = (data: SignInPayload) => {
  return api.post<AuthResponse>("/auth/sign-in", data);
};
