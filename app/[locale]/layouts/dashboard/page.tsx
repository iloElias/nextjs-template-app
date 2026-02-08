"use client";

import { Section } from "@/components/layout/section";
import { NavigationMenu } from "@/components/layout/navigation-menu";

export default function Page() {
  return (
    <Section className="flex max-w-4xl flex-col gap-4">
      <NavigationMenu />
      <h1 className="text-2xl font-semibold">Dashboard Layout</h1>
      <p className="text-default-500">This is the dashboard layout page.</p>
    </Section>
  );
}
