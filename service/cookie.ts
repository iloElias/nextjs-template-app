import { isProduction } from "@/service/env";
import { Cookies } from "react-cookie";

export const cookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: false,
  secure: isProduction(),
  sameSite: "lax" as const,
};

export const cookies = new Cookies(undefined, cookieOptions);
