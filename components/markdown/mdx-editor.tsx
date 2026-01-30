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
import { MdxImageEditToolbar } from "./mdx-image-edit-toolbar";
import { createMonacoCodeEditorDescriptor } from "./monaco-code-editor";
import { useScopedI18n } from "@/locales/client";

const imageUploadHandler = async (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(image);
  });
};

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
    <MdxEditorProvider readOnly={readOnly}>
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
              ImageDialog: () => <></>,
              EditImageToolbar: MdxImageEditToolbar as React.FC,
              imageUploadHandler,
              disableImageSettingsButton: true,
            }),
            tablePlugin({
              tableCellPadding: true,
              tablePipeAlign: true,
            }),
            codeBlockPlugin({
              defaultCodeBlockLanguage: "javascript",
              codeBlockEditorDescriptors: [
                createMonacoCodeEditorDescriptor(),
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
