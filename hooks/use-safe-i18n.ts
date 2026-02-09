"use client";

import { useCurrentLocale, useI18n } from "@/locales/client";

export function useSafeI18n() {
  try {
    return useI18n();
  } catch {
    return null;
  }
}

export function useSafeCurrentLocale(): string | null {
  try {
    return useCurrentLocale();
  } catch {
    return null;
  }
}
