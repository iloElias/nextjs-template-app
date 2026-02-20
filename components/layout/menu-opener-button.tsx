"use client";

import { Button } from "@/components/button";
import { useApp } from "@/hooks/use-app";
import { cn } from "@heroui/react";
import { HamburgerMenu, MenuDots } from "@solar-icons/react";
import { ComponentPropsWithoutRef } from "react";

export interface MenuOpenerButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "onPress"
> {
  icon?: React.ReactNode;
  iconSize?: number;
}

export const MenuOpenerButton: React.FC<MenuOpenerButtonProps> = ({
  icon,
  iconSize = 24,
  children,
  className,
  ...buttonProps
}) => {
  const { setMenuOpen } = useApp();

  const handleOpen = () => {
    setMenuOpen(true);
  };

  return (
    <Button
      size="sm"
      isIconOnly
      onPress={handleOpen}
      className={cn(className)}
      color="primary"
      {...buttonProps}
    >
      {icon || <HamburgerMenu size={iconSize} />}
      {children}
    </Button>
  );
};
