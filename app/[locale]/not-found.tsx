import { Section } from "@/components/layout/section";
import { getI18n } from "@/locales/server";

export default async function NotFound() {
  const t = await getI18n();

  return (
    <Section className="flex flex-col gap-2 max-w-md">
      <h1 className="font-semibold text-xl">{t("page.not-found.title")}</h1>
      <p className="text-default-500 text-sm">
        {t("page.not-found.description")}
      </p>
    </Section>
  );
}
