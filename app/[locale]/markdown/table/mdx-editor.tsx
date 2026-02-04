"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Checkbox } from "@heroui/react";
import ThemeToggle from "@/components/ui/theme-toggle";
import NavigationMenu from "@/components/layout/navigation-menu";

const MDXEditorComponent = dynamic(
  () =>
    import("@/components/markdown/mdx-editor").then((mod) => ({
      default: mod.MDXEditorComponent,
    })),
  { ssr: false },
);

const INITIAL_MARKDOWN = `| Feature | Supported | Notes |
| ------- | --------- | ----- |
| Bold | ✅ | Yes |
| Italic | ✅ | Yes |
| Code | ✅ | Inline and blocks |
| Tables | ✅ | Full support |

### Complex Table with Alignment

| Left Aligned | Center Aligned | Right Aligned | Mixed Content |
| :----------- | :------------: | ------------: | ------------- |
| Text | **Bold** | 100 | [Link](https://example.com) |
| More text | *Italic* | 200 | \`code\` |
| Data | ***Both*** | 300 | ~~strike~~ |
| Final row | Mixed **bold** and *italic* | 999 | Total |

### Pricing Table

| Plan | Price | Users | Storage | Support |
| ---- | ----: | ----: | ------: | :-----: |
| Free | $0 | 1 | 5 GB | Community |
| Pro | $9.99 | 5 | 100 GB | Email |
| Business | $29.99 | 25 | 1 TB | Priority |
| Enterprise | $99.99 | Unlimited | Unlimited | 24/7 |
`;

export default function MdxEditor() {
  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <div className="mx-auto p-6 max-w-5xl container">
      <div className="flex flex-col gap-3 mb-3">
        <NavigationMenu />
        <h1 className="font-bold text-3xl">Markdown Editor</h1>
        <Checkbox
          isSelected={isEditable}
          onChange={(e) => setIsEditable(e.target.checked)}
        >
          Manter editável
        </Checkbox>
        <ThemeToggle />
      </div>
      <MDXEditorComponent readOnly={!isEditable} markdown={INITIAL_MARKDOWN} />
    </div>
  );
}
