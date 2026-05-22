"use client";

import { I18nProviderClient } from "@/locales/client";
import { AppProvider } from "@/providers/app-provider";
import { FingerprintProvider } from "@/providers/fingerprint-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "./theme-provider";

export const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
}> = ({ children, locale }) => {
  const providerLocale = locale;

  return (
    <AppProvider>
      <CookiesProvider>
        <FingerprintProvider>
          <QueryProvider>
            <SessionProvider>
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
              >
                <I18nProviderClient locale={providerLocale}>
                  <I18nProvider locale={providerLocale}>
                    <ThemeProvider>
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
              </GoogleOAuthProvider>
            </SessionProvider>
          </QueryProvider>
        </FingerprintProvider>
      </CookiesProvider>
    </AppProvider>
  );
};
