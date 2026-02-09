"use client";

import { getQueryClient } from "@/lib/react-query";
import { I18nProviderClient } from "@/locales/client";
import { AppProvider } from "@/providers/app-provider";
import { SessionProvider } from "@/providers/session-provider";
import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
}> = ({ children, locale }) => {
  const providerLocale = locale;
  const [queryClient] = useState(() => getQueryClient());

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <I18nProviderClient locale={providerLocale}>
            <I18nProvider locale={providerLocale}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <HeroUIProvider
                  locale={providerLocale}
                  {...{
                    skipFramerMotionAnimations: false,
                    disableAnimation: false,
                  }}
                  labelPlacement="outside"
                >
                  {children}
                </HeroUIProvider>
              </ThemeProvider>
            </I18nProvider>
          </I18nProviderClient>
        </SessionProvider>
        {/* React Query Devtools - apenas em desenvolvimento */}
        {/* Descomente após instalar: npm install @tanstack/react-query-devtools */}
        {/* {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )} */}
      </QueryClientProvider>
    </AppProvider>
  );
};
