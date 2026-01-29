"use client";

import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { SolarProvider } from "@solar-icons/react";
import { MdxToolbar } from "./mdx-toolbar";
import { cn } from "@heroui/react";
import { MdxEditorProvider } from "./mdx-editor-context";
import { MdxLinkPreview } from "./mdx-link-preview";

interface MDXEditorComponentProps {
  markdown?: string;
  previousVersion?: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
}

export function MDXEditorComponent({
  markdown = "",
  previousVersion,
  onChange,
  readOnly = false,
}: MDXEditorComponentProps) {
  return (
    <MdxEditorProvider>
      <SolarProvider
        value={{
          weight: "LineDuotone",
          size: 20,
        }}
        svgProps={{
          className: "solar-icons",
          strokeWidth: 2,
        }}
      >
        <MdxLinkPreview />
        <MDXEditor
          markdown={markdown}
          onChange={onChange}
          readOnly={readOnly}
          className={cn(readOnly && "disabled")}
          contentEditableClassName={cn(
            "dark:prose-invert rounded-lg max-w-none min-h-125 text-default-700! prose prose-slate",
            readOnly && "p-0!",
          )}
          plugins={[
            diffSourcePlugin({
              diffMarkdown: previousVersion || "",
              viewMode: "rich-text",
            }),
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin({
              // Don't render the default dialog - we handle it in the toolbar
              LinkDialog: () => <></>,
            }),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                javascript: "JavaScript",
                ts: "TypeScript",
                typescript: "TypeScript",
                tsx: "TypeScript (React)",
                jsx: "JavaScript (React)",
                python: "Python",
                java: "Java",
                csharp: "C#",
                cpp: "C++",
                c: "C",
                go: "Go",
                rust: "Rust",
                php: "PHP",
                ruby: "Ruby",
                swift: "Swift",
                kotlin: "Kotlin",
                html: "HTML",
                css: "CSS",
                scss: "SCSS",
                json: "JSON",
                yaml: "YAML",
                xml: "XML",
                markdown: "Markdown",
                sql: "SQL",
                bash: "Bash",
                shell: "Shell",
                powershell: "PowerShell",
                dockerfile: "Dockerfile",
                plaintext: "Plain Text",
              },
            }),
            toolbarPlugin({
              toolbarContents: () => !readOnly && <MdxToolbar />,
            }),
          ]}
        />
      </SolarProvider>
    </MdxEditorProvider>
  );
}
