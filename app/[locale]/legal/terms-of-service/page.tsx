import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import TermsOfServiceContent from "./terms-of-service-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.terms-of-service");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <Section className="mx-auto max-w-3xl py-8">
        <TermsOfServiceContent />
      </Section>
    </DefaultLayout>
  );
}
