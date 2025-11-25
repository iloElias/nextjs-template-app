import type {Metadata} from "next";
import "./globals.css";
import {Providers} from "@/providers/providers";
import {Html} from "@/components/document/html";
import {Body} from "@/components/document/body";

export const metadata: Metadata = {
  title: "Murilo's Next.js Template App",
  description: "This is a template app for Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Html>
      <Body>
        <Providers>{children}</Providers>
      </Body>
    </Html>
  );
}
