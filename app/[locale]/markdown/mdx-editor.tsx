"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Checkbox } from "@heroui/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const MDXEditorComponent = dynamic(
  () =>
    import("@/components/markdown/mdx-editor").then((mod) => ({
      default: mod.MDXEditorComponent,
    })),
  { ssr: false },
);

export default function MdxEditor() {
  const [showPreviousVersion] = useState(true);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-3 flex flex-col gap-3">
        <h1 className="text-3xl font-bold flex flex-row items-center gap-4">
          Markdown Editor
          <Checkbox
            isSelected={isEditable}
            onChange={(e) => setIsEditable(e.target.checked)}
          >
            Manter editável
          </Checkbox>
        <ThemeToggle className="ml-auto"/>
        </h1>
      </div>
      <MDXEditorComponent
        readOnly={!isEditable}
        markdownUrl="/md/example.md"
        previousVersionUrl={
          showPreviousVersion ? "/md/example.prev.md" : undefined
        }
      />
    </div>
  );
}
