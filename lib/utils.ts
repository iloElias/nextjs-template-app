import { cn as heroUIcn, SlotsToClasses } from "@heroui/react";

// Re-export cn utility for use in other components
export const cn = heroUIcn;

export const mergeClassNames = <
  T extends SlotsToClasses<string> | undefined = SlotsToClasses<string>,
>(
  baseClassNames: NonNullable<T> | SlotsToClasses<string>,
  classNames?: T,
): NonNullable<T> | SlotsToClasses<string> => {
  if (!classNames) {
    return baseClassNames;
  }
  return Object.entries(classNames).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: heroUIcn(baseClassNames[key], value),
    };
  }, baseClassNames);
};

export const isEmpty = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: string | number | object | any[],
) => {
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  if (typeof value === "number" && isNaN(value)) {
    return true;
  }
  return false;
};

export const normalizeLocale = (locale: string): string => {
  const baseLocale = locale.split("-")[0].toLowerCase();
  const supportedLocales = [
    "en",
    "pt",
    "es",
    "fr",
    "de",
    "it",
    "ja",
    "ko",
    "zh",
    "ru",
    "ar",
    "hi",
  ];
  return supportedLocales.includes(baseLocale) ? baseLocale : "en";
};

export const upperCaseFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
