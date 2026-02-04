"use client";

import { Section } from "./section";
import NavigationMenu from "./navigation-menu";

export const DashboardLayout: React.FC = () => {
  return (
    <Section className="flex flex-col gap-4">
      <NavigationMenu />
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-xl">Dashboard Component</h2>
        <p className="text-default-500 text-sm">Dashboard layout content goes here.</p>
      </div>
    </Section>
  );
};
