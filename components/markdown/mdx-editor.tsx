"use client";

import { useScopedI18n } from "@/locales/client";
import { Card, CardBody, cn } from "@heroui/react";
import {
  codeBlockPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { SolarProvider } from "@solar-icons/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { getCodeMirrorExtensions } from "../../lib/codemirror-extensions";
import { convertReferenceLinksToInline } from "../../lib/markdown-utils";
import { emojiAutocompletePlugin } from "../emoji/emoji-autocomplete-plugin-wrapper";
import { Loading } from "../loading";
import { createMonacoCodeEditorDescriptor } from "../monaco-editor/monaco-code-editor";
import { MdxEditorProvider } from "./mdx-editor-context";
import { MdxImageEditToolbar } from "./mdx-image-edit-toolbar";
import { MdxLinkPreview } from "./mdx-link-preview";
import { MdxToolbar } from "./mdx-toolbar";

const imageUploadHandler = async (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(image);
  });
};

const fetchMarkdownFile = async (path: string): Promise<string> => {
  const response = await axios.get(path, {
    responseType: "text",
    headers: {
      "Content-Type": "text/plain",
    },
  });

  let data = response.data;

  data = data.replace(/(<a[^>]*)\s+hr\s*\n?\s*f=/gi, "$1 href=");
  data = data.replace(/\.vg\b/g, ".svg");

  data = convertReferenceLinksToInline(data);

  const voidTags = [
    "img",
    "br",
    "hr",
    "input",
    "meta",
    "link",
    "area",
    "base",
    "col",
    "embed",
    "param",
    "source",
    "track",
    "wbr",
  ];

  voidTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, "gi");
    data = data.replace(regex, (match: string, inside: string) => {
      const trimmed = inside.trimEnd();
      const isAlreadySelfClosing = trimmed.endsWith("/");

      if (isAlreadySelfClosing) {
        return match;
      }

      if (trimmed) {
        return `<${tag}${trimmed} />`;
      } else {
        return `<${tag} />`;
      }
    });
  });

  const codeBlocks: string[] = [];

  data = data.replace(
    /(```[\s\S]*?```|`[^`]+`)/g,
    (match: string, code: string) => {
      codeBlocks.push(code);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    },
  );

  data = data.replace(/<(https?:\/\/[^\s>]+)>/g, "[$1]($1)");

  data = data.replace(/(?<![([\["`:])(https?:\/\/[^\s<>)\]]+)/g, "[$1]($1)");

  codeBlocks.forEach((code, index) => {
    data = data.replace(`__CODE_BLOCK_${index}__`, code);
  });

  return data;
};

interface MDXEditorComponentProps {
  markdown?: string;
  markdownUrl?: string;
  previousVersion?: string;
  previousVersionUrl?: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
}

export const MDXEditorComponent: React.FC<MDXEditorComponentProps> = ({
  markdown: markdownProp,
  markdownUrl,
  previousVersion: previousVersionProp,
  previousVersionUrl,
  onChange,
  readOnly = false,
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { resolvedTheme } = useTheme();

  const { data: fetchedMarkdown, isLoading: isLoadingMarkdown } = useQuery({
    queryKey: ["markdown", markdownUrl],
    queryFn: () => fetchMarkdownFile(markdownUrl!),
    enabled: !!markdownUrl && !markdownProp,
  });

  const { data: fetchedPreviousVersion, isLoading: isLoadingPrevious } =
    useQuery({
      queryKey: ["markdown", previousVersionUrl],
      queryFn: () => fetchMarkdownFile(previousVersionUrl!),
      enabled: !!previousVersionUrl && !previousVersionProp,
    });

  const markdown = markdownProp ?? fetchedMarkdown ?? "";
  const previousVersion = previousVersionProp ?? fetchedPreviousVersion;
  const isLoading = isLoadingMarkdown || isLoadingPrevious;

  const loadingLabel = useMemo(() => {
    if (isLoadingMarkdown) return tmdx("loading.markdown");
    if (isLoadingPrevious) return tmdx("loading.previousVersion");
    return readOnly ? tmdx("loading.content") : tmdx("loading.markdown");
  }, [isLoadingMarkdown, isLoadingPrevious, readOnly, tmdx]);

  const codeMirrorExtensions = useMemo(() => {
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    return getCodeMirrorExtensions(theme);
  }, [resolvedTheme]);

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
        {isLoading && (
          <Card className="flex items-center justify-center rounded-large p-8 shadow-small">
            <CardBody>
              <Loading label={loadingLabel} />
            </CardBody>
          </Card>
        )}
        {!isLoading && (
          <MDXEditor
            key={`${markdownUrl || previousVersionUrl || "static"}-${resolvedTheme}`}
            markdown={markdown}
            onChange={onChange}
            readOnly={readOnly}
            translation={(key, defaultValue) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return tmdx(key as any) || defaultValue;
            }}
            className={cn(readOnly && "disabled")}
            contentEditableClassName={cn(
              "dark:prose-invert rounded-lg max-w-none min-h-125 text-default-700! prose prose-slate editor-content",
              readOnly && "p-0! editor-readonly",
            )}
            plugins={[
              diffSourcePlugin({
                diffMarkdown: previousVersion || "",
                viewMode: "rich-text",
                codeMirrorExtensions,
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
                toolbarClassName: cn(
                  "scrollbar top-2! mb-2 overflow-x-auto! rounded-xl! border-default-200! bg-background! p-2! dark:bg-default-50! shadow-small!",
                ),
                toolbarContents: () =>
                  !readOnly && (
                    <MdxToolbar hasPrevioesVersion={!!previousVersion} />
                  ),
              }),
              ...(!readOnly ? [emojiAutocompletePlugin()] : []),
            ]}
          />
        )}
      </SolarProvider>
    </MdxEditorProvider>
  );
};
