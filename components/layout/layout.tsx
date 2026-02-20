"use client";

import Header from "./header";
import { NavigationMenu } from "./navigation-menu";

export interface LayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavigationMenu />
      <Header />
      {children}
    </>
  );
};
