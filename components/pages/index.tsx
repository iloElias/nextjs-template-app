"use client";
import { Section } from "../layout/section";
import {useI18n} from "@/locales/client";

export default function Home() {
  const t = useI18n();

  return (
    <Section className="flex flex-col gap-2 max-w-md">
      <h1 className="font-semibold text-xl">{t("home.title")}</h1>
      <p className="text-default-500 text-sm">{t("home.subtitle")}</p>
    </Section>
  );
}
