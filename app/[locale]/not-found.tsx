import { Section } from "@/components/layout/section";
import { getI18n } from "@/locales/server";

export default async function NotFound() {
  const t = await getI18n();

  return (
    <Section className="flex max-w-md flex-col gap-2">
      <h1 className="text-xl font-semibold">{t("page.not-found.title")}</h1>
      <p className="text-sm text-default-500">
        {t("page.not-found.description")}
      </p>
    </Section>
  );
}
