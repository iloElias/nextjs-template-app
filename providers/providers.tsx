"use client";

import {HeroUIProvider} from "@heroui/react";
import {I18nProvider} from "@react-aria/i18n";
import {I18nProviderClient} from "@/locales/client";

export const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
}> = ({children, locale}) => {
  const providerLocale = locale;

  return (
    <I18nProviderClient locale={providerLocale}>
      <I18nProvider locale={providerLocale}>
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
      </I18nProvider>
    </I18nProviderClient>
  );
};
