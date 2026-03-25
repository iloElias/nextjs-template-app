import { DefaultLayout } from "@/components/layout/layout";
import FormPage from "@/components/pages/playground/form";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.form-playground");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <FormPage />
    </DefaultLayout>
  );
}
