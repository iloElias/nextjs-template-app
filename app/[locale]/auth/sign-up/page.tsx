import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import Register from "./register";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.register");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout hideHeader>
      <Section className="mx-auto mt-20 max-w-md">
        <Register />
      </Section>
    </DefaultLayout>
  );
}
