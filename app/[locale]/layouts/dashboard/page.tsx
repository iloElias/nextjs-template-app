"use client";

import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { useEffect } from "react";

export default function Page() {
  const t = useSafeI18n();

  useEffect(() => {
    if (t) {
      document.title = t("metadata.layouts-dashboard.title");
    }
  }, [t]);

  return (
    <DefaultLayout>
      <Section className="flex max-w-4xl flex-col gap-4">
        <h1 className="text-2xl font-semibold">Dashboard Layout</h1>
        <p className="text-default-500">This is the dashboard layout page.</p>
      </Section>
    </DefaultLayout>
  );
}
