"use client";

import { useSafeI18n } from "@/hooks/use-safe-i18n";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorConfig, ErrorType, defaultErrorConfigs } from "./types";

export interface ErrorDisplayProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  statusCode?: number;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  homeButtonLabel?: string;
  backButtonLabel?: string;
  customAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function ErrorDisplay({
  type = "error",
  title,
  description,
  statusCode,
  icon,
  showHomeButton,
  showBackButton,
  homeButtonLabel,
  backButtonLabel,
  customAction,
  className = "",
}: ErrorDisplayProps) {
  const router = useRouter();
  const t = useSafeI18n();
  const defaultConfig = defaultErrorConfigs[type];

  const config: ErrorConfig = {
    title: title ?? defaultConfig.title,
    description: description ?? defaultConfig.description,
    statusCode: statusCode ?? defaultConfig.statusCode,
    icon: icon,
    showHomeButton: showHomeButton ?? defaultConfig.showHomeButton,
    showBackButton: showBackButton ?? defaultConfig.showBackButton,
    customAction: customAction,
  };

  const getButtonLabel = (buttonType: "go-home" | "go-back"): string => {
    if (buttonType === "go-home" && homeButtonLabel) return homeButtonLabel;
    if (buttonType === "go-back" && backButtonLabel) return backButtonLabel;

    if (!t) {
      return buttonType === "go-home" ? "Go to Home" : "Go Back";
    }
    const key = `page.${type}.${buttonType}` as const;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any, {});
    } catch {
      return buttonType === "go-home" ? "Go to Home" : "Go Back";
    }
  };

  return (
    <section
      className={`container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 py-8 ${className}`}
    >
      {config.icon && (
        <div className="flex justify-center text-6xl text-default-400">
          {config.icon}
        </div>
      )}

      {config.statusCode && (
        <div className="text-center text-8xl font-bold text-default-200">
          {config.statusCode}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold">{config.title}</h1>
        <p className="text-center text-sm text-default-500">
          {config.description}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {config.showHomeButton && (
          <Button as={Link} href="/" color="primary">
            {getButtonLabel("go-home")}
          </Button>
        )}

        {config.showBackButton && (
          <Button variant="flat" onPress={() => router.back()}>
            {getButtonLabel("go-back")}
          </Button>
        )}

        {config.customAction && (
          <>
            {config.customAction.href ? (
              <Button
                as={Link}
                href={config.customAction.href}
                variant="bordered"
              >
                {config.customAction.label}
              </Button>
            ) : (
              <Button variant="bordered" onPress={config.customAction.onClick}>
                {config.customAction.label}
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
