import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import MdxEditor from "./mdx-editor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.markdown-table");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <Section>
        <MdxEditor />
      </Section>
    </DefaultLayout>
  );
}
