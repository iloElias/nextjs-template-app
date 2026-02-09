"use client";

import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Button, Checkbox, Input } from "@heroui/react";
import { Magnifer, Refresh } from "@solar-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDXEditorComponent = dynamic(
  () =>
    import("@/components/markdown/mdx-editor").then((mod) => ({
      default: mod.MDXEditorComponent,
    })),
  { ssr: false },
);

export default function MdxEditor() {
  const [markdownUrl, setMarkdownUrl] = useState<string>(
    "https://gist.githubusercontent.com/allysonsilva/85fff14a22bbdf55485be947566cc09e/raw/fa8048a906ebed3c445d08b20c9173afd1b4a1e5/Full-Markdown.md",
  );
  const [searchMarkdownUrl, setSearchMarkdownUrl] =
    useState<string>(markdownUrl);

  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-3 flex flex-col gap-3">
        <NavigationMenu />
        <h1 className="text-3xl font-bold">Markdown Editor</h1>
        <Checkbox
          isSelected={isEditable}
          onChange={(e) => setIsEditable(e.target.checked)}
        >
          Manter editável
        </Checkbox>
        <div className="flex flex-row items-end gap-2">
          <Button
            onPress={() => setSearchMarkdownUrl(searchMarkdownUrl)}
            isIconOnly
          >
            <Refresh />
          </Button>
          <Input
            label=""
            value={searchMarkdownUrl}
            onChange={(e) => setSearchMarkdownUrl(e.target.value)}
          />
          <Button onPress={() => setMarkdownUrl(searchMarkdownUrl)} isIconOnly>
            <Magnifer />
          </Button>
        </div>
      </div>
      <MDXEditorComponent readOnly={!isEditable} markdownUrl={markdownUrl} />
    </div>
  );
}
