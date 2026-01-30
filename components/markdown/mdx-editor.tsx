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
  tablePlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { SolarProvider } from "@solar-icons/react";
import { MdxToolbar } from "./mdx-toolbar";
import { cn } from "@heroui/react";
import { MdxEditorProvider } from "./mdx-editor-context";
import { MdxLinkPreview } from "./mdx-link-preview";
import { createMonacoCodeEditorDescriptor } from "./monaco-code-editor";
import { useScopedI18n } from "@/locales/client";

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
  const tmdx = useScopedI18n("mdx-editor");

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
          translation={(key, defaultValue) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return tmdx(key as any) || defaultValue;
          }}
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
              LinkDialog: () => <></>,
            }),
            imagePlugin({
              
            }),
            tablePlugin(),
            codeBlockPlugin({
              defaultCodeBlockLanguage: "javascript",
              codeBlockEditorDescriptors: [
                createMonacoCodeEditorDescriptor(readOnly),
              ],
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
