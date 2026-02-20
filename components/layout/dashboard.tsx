"use client";

import { Section } from "./section";

export const DashboardLayout: React.FC = () => {
  return (
    <Section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Dashboard Component</h2>
        <p className="text-sm text-default-500">
          Dashboard layout content goes here.
        </p>
      </div>
    </Section>
  );
};
