"use client";

import { getQueryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";
import { useState } from "react";

export const QueryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
