"use client";

import { createI18nClient } from "next-international/client";
import { locales } from "./locales";

export const {
  useI18n,
  useScopedI18n,
  useChangeLocale,
  useCurrentLocale,
  I18nProviderClient,
} = createI18nClient(locales);
