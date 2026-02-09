"use client";

import { I18nProviderClient } from "@/locales/client";
import { AppProvider } from "@/providers/app-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { ThemeProvider } from "next-themes";
import { CookiesProvider } from "react-cookie";

export const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
}> = ({ children, locale }) => {
  const providerLocale = locale;

  return (
    <AppProvider>
      <CookiesProvider>
        <QueryProvider>
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
        </QueryProvider>
      </CookiesProvider>
    </AppProvider>
  );
};
