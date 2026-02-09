import { DefaultLayout } from "@/components/layout/layout";
import { getScopedI18n } from "@/locales/server";
import type { Metadata } from "next";
import MdxEditor from "./mdx-editor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.mdx-editor");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return (
    <DefaultLayout>
      <MdxEditor />
    </DefaultLayout>
  );
}
