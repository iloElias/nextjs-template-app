"use client";
import { Section } from "../layout/section";
import { useI18n } from "@/locales/client";
import NavigationMenu from "../layout/navigation-menu";

export default function Home() {
  const t = useI18n();

  return (
    <Section className="flex max-w-md flex-col gap-2">
      <NavigationMenu />
      <h1 className="text-xl font-semibold">{t("page.home.title")}</h1>
      <p className="text-sm text-default-500">{t("page.home.subtitle")}</p>
    </Section>
  );
}
