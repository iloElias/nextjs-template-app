import { api } from "@/service/api";
import { User } from "@/types/user";

export const getMe = () => {
  return api.get<User>("/auth/me");
};
