"use client";

import { useState } from "react";
import { MDXEditorComponent } from "@/components/markdown/mdx-editor";
import { Checkbox } from "@heroui/react";

const INITIAL_MARKDOWN = `# Welcome to MDX Editor

## Getting Started

This is a **rich text editor** for *Markdown* content.

**TODO**: Ainda falta configurar o seletor de tipos de bloco

### Features

* **Bold**, *italic*, and ~~strikethrough~~ text
* Lists and checkboxes
* Code blocks with syntax highlighting
* Tables

| Titulo 1 | Titulo 2 | Titulo 3 |
| -------- | -------- | -------- |
| Teste    | Teste    | Teste    |
| Teste    | Teste    | Teste    |

* Links and images
* And much more!

\`\`\`typescript
const greeting = "Hello, MDX Editor!";
console.log(greeting);
\`\`\`

***

Try editing this content!`;

const PREVIOUS_VERSION = `# Welcome to MDX Editor

## Getting Started

This is a text editor for Markdown content.

### Features

- Bold and italic text
- Lists
- Code blocks
- Links

\`\`\`javascript
console.log("Hello!");
\`\`\`

---

Try it out!
`;

export default function Page() {
  const [showPreviousVersion] = useState(true);

  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <div className="mx-auto p-6 max-w-5xl container">
      <div className="flex flex-col gap-3 mb-3">
        <h1 className="font-bold text-3xl">Markdown Editor</h1>
        <Checkbox
          isSelected={isEditable}
          onChange={(e) => setIsEditable(e.target.checked)}
        >
          Manter editável
        </Checkbox>
      </div>
      <MDXEditorComponent
        readOnly={!isEditable}
        markdown={INITIAL_MARKDOWN}
        previousVersion={showPreviousVersion ? PREVIOUS_VERSION : undefined}
        // onChange={setMarkdown}
      />
    </div>
  );
}
