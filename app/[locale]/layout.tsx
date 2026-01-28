import type {Metadata} from "next";
import {Providers} from "@/providers/providers";
import {getStaticParams} from "@/locales/server";
import {setStaticParamsLocale} from "next-international/server";

export const metadata: Metadata = {
  title: "Murilo's Next.js Template App",
  description: "This is a template app for Next.js",
};

export const generateStaticParams = getStaticParams;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  setStaticParamsLocale(locale);

  return <Providers locale={locale}>{children}</Providers>;
}
