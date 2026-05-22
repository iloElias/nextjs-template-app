"use client";

import "@/app/styles/utilities/mdx-print.css";

import { use } from "react";
import MdxEditor from "./mdx-editor";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string; project: string }>;
}) {
  const { project } = use(params);

  return (
    <>
      <style>{`
        body {
          padding: 0 !important;
        }
      `}</style>
      <div className="print-container overflow-hidden!">
        <MdxEditor projectId={project} readonly />
      </div>
    </>
  );
}
