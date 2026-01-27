import "./globals.css";
import { Body } from "@/components/document/body";
import { Html } from "@/components/document/html";
import { DEFAULT_LOCALE } from "@/service/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Html lang={DEFAULT_LOCALE}>
      <Body>
        {children}
      </Body>
    </Html>
  );
}
