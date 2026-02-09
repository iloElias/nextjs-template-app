export const locales = {
  en: () => import("./locales/en"),
  "pt-BR": () => import("./locales/pt-BR"),
} as const;

export type Locales = keyof typeof locales;
