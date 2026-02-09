import { getScopedI18n, getStaticParams } from "@/locales/server";
import { Providers } from "@/providers/providers";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("metadata.home");

  return {
    title: {
      template: "%s | Murilo's Next.js Template App",
      default: t("title"),
    },
    description: t("description"),
  };
}

export const generateStaticParams = getStaticParams;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return <Providers locale={locale}>{children}</Providers>;
}
