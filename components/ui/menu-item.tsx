"use client";

import { Button, cn } from "@heroui/react";
import Link from "next/link";

interface MenuItemProps {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  variant?: "light" | "flat" | "solid";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MenuItem({
  label,
  icon,
  href,
  variant = "light",
  size = "md",
  className,
}: MenuItemProps) {
  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "w-full justify-start transition-colors hover:bg-default-100",
        className,
      )}
      startContent={icon}
    >
      {label}
    </Button>
  );

  return href ? <Link href={href}>{button}</Link> : button;
}

interface MenuItemGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MenuItemGroup({ children, className }: MenuItemGroupProps) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}
