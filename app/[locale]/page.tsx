import { DefaultLayout } from "@/components/layout/layout";
import Home from "@/components/pages";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.home");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <Home />
    </DefaultLayout>
  );
}
