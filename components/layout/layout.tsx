"use client";

import Header from "./header";
import { NavigationMenu } from "./navigation-menu";

export interface LayoutProps {
  hideHeader?: boolean;
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<LayoutProps> = ({ children, hideHeader }) => {
  return (
    <>
      <NavigationMenu />
      <Header hidden={hideHeader} />
      {children}
    </>
  );
};
