"use client";

import {useLocale} from "@react-aria/i18n";

export const Html: React.FC<React.HTMLAttributes<HTMLHtmlElement>> = ({children, lang, ...props}) => {
  const {locale} = useLocale();

  return (
    <html lang={lang ?? locale} {...props}>
      {children}
    </html>
  );
};
