"use client";

import {useLocale} from "@react-aria/i18n";

export const Html: React.FC<React.HTMLAttributes<HTMLHtmlElement>> = ({children, ...props}) => {
  const {locale} = useLocale();

  return (
    <html lang={locale} {...props}>
      {children}
    </html>
  );
};
