"use client";

import Header from "./header";

export interface LayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
