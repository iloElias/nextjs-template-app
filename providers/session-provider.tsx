"use client";

import { getMe } from "@/http/auth/get-me";
import { queryKeys } from "@/lib/react-query";
import { AUTH_TOKEN_KEY, AUTHENTICATED_KEY } from "@/proxy";
import { cookieOptions } from "@/service/cookie";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "ilias-use-storage";
import { createContext, useCallback, useState } from "react";
import { useCookies } from "react-cookie";

export interface SessionContextValue {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
  user: User | null | undefined;
  hasPassword: boolean;
  logout: () => void;
  refetchUser: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [localStoredUser, setLocalStoredUser] = useLocalStorage<
    User | undefined
  >("user", undefined);
  const [cookies, setCookie, removeCookie] = useCookies([
    AUTH_TOKEN_KEY,
    AUTHENTICATED_KEY,
  ]);

  const [token, setAuthTokenState] = useState<string | undefined>(
    cookies[AUTH_TOKEN_KEY],
  );
  const [hasPassword, setHasPassword] = useState<boolean>(true);

  const {
    data: user,
    refetch: refetchUser,
    isLoading,
  } = useQuery<User | null>({
    queryKey: queryKeys.auth.me,
    queryFn: async (): Promise<User | null> => {
      try {
        const { data } = await getMe();
        setLocalStoredUser(data);
        setHasPassword(data?.has_password ?? true);
        return data ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!token,
    initialData: localStoredUser,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
  });

  // Função para definir o token
  const setToken = useCallback(
    (newToken: string | undefined) => {
      if (newToken) {
        setCookie(AUTH_TOKEN_KEY, newToken, cookieOptions);
        setCookie(AUTHENTICATED_KEY, "true", cookieOptions);
        setAuthTokenState(newToken);
      } else {
        removeCookie(AUTH_TOKEN_KEY, cookieOptions);
        removeCookie(AUTHENTICATED_KEY, cookieOptions);
        setAuthTokenState(undefined);
      }
    },
    [setCookie, removeCookie],
  );

  // Função para fazer logout
  const logout = useCallback(() => {
    removeCookie(AUTH_TOKEN_KEY, cookieOptions);
    removeCookie(AUTHENTICATED_KEY, cookieOptions);
    setAuthTokenState(undefined);
    setLocalStoredUser(undefined);
    setHasPassword(true);
  }, [removeCookie, setLocalStoredUser]);

  const isAuthenticated = !!token && !!user;

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken,
        user,
        hasPassword,
        logout,
        refetchUser,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
