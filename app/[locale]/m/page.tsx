import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import Projects from "./projects";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.markdown-projects");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <Section>
        <Projects />
      </Section>
    </DefaultLayout>
  );
}
