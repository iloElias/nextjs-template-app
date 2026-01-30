"use client";

import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { I18nProviderClient } from "@/locales/client";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/contexts/app-context";

export const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
}> = ({ children, locale }) => {
  const providerLocale = locale;

  return (
    <AppProvider>
      <I18nProviderClient locale={providerLocale}>
        <I18nProvider locale={providerLocale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
    </AppProvider>
  );
};
