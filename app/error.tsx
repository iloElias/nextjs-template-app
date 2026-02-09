"use client";

import { ErrorDisplay } from "@/components/error/error-display";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      type="error"
      customAction={{
        label: "Try Again",
        onClick: reset,
      }}
    />
  );
}
