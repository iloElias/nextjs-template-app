"use client";

import { Section } from "@/components/layout/section";
import NavigationMenu from "@/components/layout/navigation-menu";

export default function Page() {
  return (
    <Section className="flex flex-col gap-4 max-w-4xl">
      <NavigationMenu />
      <h1 className="font-semibold text-2xl">Dashboard Layout</h1>
      <p className="text-default-500">This is the dashboard layout page.</p>
    </Section>
  );
}
