"use client";

import { HeroUIProvider } from "@heroui/react";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};
