import { Section } from "@/components/layout/section";
import { useI18n } from "@/locales/client";

export default function Page() {
  const t = useI18n();

  return (
    <Section className="flex flex-col gap-2 max-w-md">
      <h1 className="font-semibold text-xl">{t("not-found.title")}</h1>
      <p className="text-default-500 text-sm">{t("not-found.description")}</p>
    </Section>
  );
}
