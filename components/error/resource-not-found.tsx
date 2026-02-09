"use client";

import { ErrorDisplay } from "@/components/error/error-display";
import { useSafeI18n } from "@/hooks/use-safe-i18n";

export interface ResourceNotFoundProps {
  resourceName?: string;
  resourceId?: string | number;
  customDescription?: string;
  onGoBack?: () => void;
}

/**
 * Component for displaying "resource not found" errors when a page exists
 * but a specific resource/register doesn't exist.
 *
 * Example usage:
 * ```tsx
 * <ResourceNotFound
 *   resourceName="Product"
 *   resourceId="123"
 * />
 * ```
 */
export function ResourceNotFound({
  resourceName = "Resource",
  resourceId,
  customDescription,
  onGoBack,
}: ResourceNotFoundProps) {
  const t = useSafeI18n();

  const description =
    customDescription ||
    (resourceId
      ? `${resourceName} with ID "${resourceId}" could not be found.`
      : t
        ? t("page.resource-not-found.description")
        : "The resource or register you are looking for could not be found.");

  return (
    <ErrorDisplay
      type="resource-not-found"
      title={t ? t("page.resource-not-found.title") : "Resource Not Found"}
      description={description}
      backButtonLabel={t ? t("page.resource-not-found.go-back") : "Go Back"}
      customAction={
        onGoBack
          ? {
              label: t ? t("page.resource-not-found.go-back") : "Go Back",
              onClick: onGoBack,
            }
          : undefined
      }
    />
  );
}
