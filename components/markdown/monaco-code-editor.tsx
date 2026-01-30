"use client";

import {
  CodeBlockEditorDescriptor,
  useCodeBlockEditorContext,
} from "@mdxeditor/editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { LanguageSelector } from "./language-selector";
import { useMdxEditor } from "./mdx-editor-context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TrashBin2, Copy, CheckCircle } from "@solar-icons/react";
import { Button, cn, Tooltip } from "@heroui/react";
import { MdxButton } from "./mdx-button";
import { useAppContext } from "@/contexts/app-context";

const defineCustomThemes = (monaco: Monaco) => {
  monaco.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "regexp", foreground: "f1fa8c" },
      { token: "type", foreground: "8be9fd" },
      { token: "class", foreground: "8be9fd" },
      { token: "function", foreground: "50fa7b" },
      { token: "variable", foreground: "f8f8f2" },
      { token: "constant", foreground: "bd93f9" },
      { token: "operator", foreground: "ff79c6" },
      { token: "delimiter", foreground: "f8f8f2" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editorLineNumber.foreground": "#6272a4",
      "editorCursor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
      "editor.lineHighlightBackground": "#44475a75",
      "editorWhitespace.foreground": "#44475a",
      "editorIndentGuide.background": "#44475a",
    },
  });

  monaco.editor.defineTheme("dracula-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "d91b8a" },
      { token: "string", foreground: "8f7e00" },
      { token: "number", foreground: "8e44d9" },
      { token: "regexp", foreground: "8f7e00" },
      { token: "type", foreground: "0099b3" },
      { token: "class", foreground: "0099b3" },
      { token: "function", foreground: "00994d" },
      { token: "variable", foreground: "383a42" },
      { token: "constant", foreground: "8e44d9" },
      { token: "operator", foreground: "d91b8a" },
      { token: "delimiter", foreground: "383a42" },
    ],
    colors: {
      "editor.background": "#f8f8f8",
      "editor.foreground": "#383a42",
      "editorLineNumber.foreground": "#9ca3af",
      "editorCursor.foreground": "#383a42",
      "editor.selectionBackground": "#d1d5da",
      "editor.lineHighlightBackground": "#efefef",
      "editorWhitespace.foreground": "#d1d5da",
      "editorIndentGuide.background": "#d1d5da",
    },
  });
};

const MonacoEditorComponent: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const { setCode, lexicalNode } = useCodeBlockEditorContext();
  const [editor] = useLexicalComposerContext();
  const { resolvedTheme } = useTheme();
  const { currentCodeLanguage, setCurrentCodeLanguage, readOnly } =
    useMdxEditor();
  const { mounted } = useAppContext();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  const editorTheme = resolvedTheme === "dark" ? "dracula" : "dracula-light";

  const editorHeight = useMemo(() => {
    const lines = code.split("\n").length;
    const lineHeight = 20;
    const padding = 0;
    const minHeight = 0;
    const maxHeight = 300;
    const calculatedHeight = lines * lineHeight + padding;
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  }, [code]);

  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      yml: "yaml",
      sh: "shell",
      md: "markdown",
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  useEffect(() => {
    if (
      isFocused &&
      currentCodeLanguage &&
      currentCodeLanguage !== currentLanguage
    ) {
      setCurrentLanguage(currentCodeLanguage);
      editor.update(() => {
        const writableNode = lexicalNode.getWritable();
        writableNode.setLanguage(currentCodeLanguage);
      });
    }
  }, [currentCodeLanguage, isFocused, currentLanguage, editor, lexicalNode]);

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    setCurrentCodeLanguage(value);

    editor.update(() => {
      const writableNode = lexicalNode.getWritable();
      writableNode.setLanguage(value);
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setCurrentCodeLanguage(currentLanguage);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className={cn(
        "border border-default-200 rounded-lg overflow-hidden",
        readOnly && "bg-default-50/50",
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <div
        className={cn(
          "flex justify-between items-center bg-background px-2 py-2 border-default-200 border-b",
          { "justify-between": readOnly },
        )}
      >
        {!readOnly ? (
          <>
            <LanguageSelector
              label=""
              value={currentLanguage}
              onChange={handleLanguageChange}
            />
            <MdxButton
              role="Delete code block"
              onPress={() => {
                editor.update(() => {
                  lexicalNode.remove();
                });
              }}
            >
              <TrashBin2 />
            </MdxButton>
          </>
        ) : (
          <>
            <span className="font-mono text-default-500 text-xs">
              {currentLanguage}
            </span>
            <Tooltip
              content={copied ? "Copied!" : "Copy code"}
              isOpen={copied ? true : undefined}
            >
              <div>
                <Button
                  size="sm"
                  isIconOnly
                  className={cn(
                    "bg-default-100 hover:bg-default-200 h-8",
                    copied ? "bg-success-100!" : "",
                  )}
                  onPress={async () => {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? <CheckCircle /> : <Copy />}
                </Button>
              </div>
            </Tooltip>
          </>
        )}
      </div>
      <div
        className="py-1!"
        onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}
      >
        {mounted && resolvedTheme ? (
          <Editor
            key={`monaco-editor-${readOnly}-${editorTheme}`}
            height={`${editorHeight}px`}
            language={getMonacoLanguage(currentLanguage)}
            value={code}
            onChange={(value) => {
              if (!readOnly) {
                setCode(value || "");
              }
            }}
            onMount={(editor, monaco) => {
              defineCustomThemes(monaco);
            }}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              readOnly: readOnly,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
                verticalScrollbarSize: 0,
                horizontalScrollbarSize: 0,
                alwaysConsumeMouseWheel: false,
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              ...(readOnly && {
                domReadOnly: true,
                readOnly: true,
                cursorStyle: "line-thin",
                cursorBlinking: "solid",
                renderLineHighlight: "none",
                contextmenu: false,
                quickSuggestions: false,
                parameterHints: { enabled: false },
                suggest: { showWords: false },
                folding: false,
                glyphMargin: false,
                occurrencesHighlight: "off",
                selectionHighlight: false,
                renderWhitespace: "none",
                guides: {
                  indentation: false,
                },
                hover: {
                  enabled: false,
                },
                links: false,
                colorDecorators: false,
              }),
            }}
          />
        ) : (
          <div
            style={{ height: `${editorHeight}px` }}
            className="bg-default-100 animate-pulse"
          />
        )}
      </div>
    </div>
  );
};

export const createMonacoCodeEditorDescriptor = (
  readOnly = false,
): CodeBlockEditorDescriptor => ({
  match: () => true,
  priority: 1,
  Editor: (props) => (
    <MonacoEditorComponent code={props.code} language={props.language} />
  ),
});
