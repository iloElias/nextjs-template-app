"use client";

import {HeroUIProvider} from "@heroui/react";
import {I18nProvider, useLocale} from "@react-aria/i18n";

export const Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {locale} = useLocale();

  return (
    <>
      <I18nProvider locale={locale}>
        <HeroUIProvider
          locale={locale}
          {...{
            skipFramerMotionAnimations: false,
            disableAnimation: false,
          }}
          labelPlacement="outside"
        >
          {children}
        </HeroUIProvider>
      </I18nProvider>
    </>
  );
};
