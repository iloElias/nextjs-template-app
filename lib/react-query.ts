import { DefaultOptions, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    throwOnError: false,
  },
  mutations: {
    retry: 1,
    retryDelay: 1000,
    throwOnError: false,
  },
};

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

export const queryKeys = {
  auth: {
    me: ["me"] as const,
    user: (id: string) => ["user", id] as const,
    users: (filters?: Record<string, unknown>) =>
      filters ? (["users", filters] as const) : (["users"] as const),
  },
  posts: {
    all: ["posts"] as const,
    list: (filters?: Record<string, unknown>) =>
      filters
        ? (["posts", "list", filters] as const)
        : (["posts", "list"] as const),
    detail: (id: string) => ["posts", "detail", id] as const,
    comments: (postId: string) => ["posts", postId, "comments"] as const,
  },
} as const;

export type QueryKey = readonly unknown[];

export const commonQueryOptions = {
  static: {
    staleTime: Infinity,
    gcTime: Infinity,
  },
  realtime: {
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchInterval: 5000,
  },
  dynamic: {
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  },
  paginated: {
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    keepPreviousData: true,
  },
} as const;
