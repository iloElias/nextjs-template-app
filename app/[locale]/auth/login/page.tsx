import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import Login from "./login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.login");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout hideHeader>
      <Section className="max-w-md mx-auto mt-20">
        <Login />
      </Section>
    </DefaultLayout>
  );
}
