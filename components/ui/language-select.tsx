"use client";

import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Locales } from "@/locales/locales";
import { Select, SelectItem, SelectProps } from "@heroui/react";

export interface LocaleItem {
  key: Locales;
  label: string;
}

export const LanguageSelect: React.FC<
  Omit<SelectProps<LocaleItem>, "value" | "children">
> = ({ ...props }) => {
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const locales: LocaleItem[] = [
    { key: "en", label: "English" },
    { key: "pt-BR", label: "Português (BR)" },
  ];

  return (
    <Select<LocaleItem>
      aria-label=" "
      selectedKeys={[currentLocale]}
      onSelectionChange={(keys) => changeLocale(Array.from(keys)[0] as Locales)}
      items={locales}
      {...props}
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
};
