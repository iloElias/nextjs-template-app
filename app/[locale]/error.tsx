"use client";

import { ErrorDisplay } from "@/components/error/error-display";
import { useI18n } from "@/locales/client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useI18n();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      type="error"
      title={t("page.error.title")}
      description={t("page.error.description")}
      homeButtonLabel={t("page.error.go-home")}
      customAction={{
        label: t("page.error.try-again"),
        onClick: reset,
      }}
    />
  );
}
