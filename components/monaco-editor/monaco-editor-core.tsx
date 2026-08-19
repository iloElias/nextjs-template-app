"use client";

import { useApp } from "@/hooks/use-app";
import { cn } from "@heroui/react";
import Editor, { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

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
      { token: "comment", foreground: "6a737d", fontStyle: "italic" },
      { token: "keyword", foreground: "af00db" },
      { token: "string", foreground: "22863a" },
      { token: "number", foreground: "005cc5" },
      { token: "regexp", foreground: "032f62" },
      { token: "type", foreground: "6f42c1" },
      { token: "class", foreground: "6f42c1" },
      { token: "function", foreground: "005cc5" },
      { token: "variable", foreground: "24292e" },
      { token: "constant", foreground: "005cc5" },
      { token: "operator", foreground: "d73a49" },
      { token: "delimiter", foreground: "24292e" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#24292e",
      "editorLineNumber.foreground": "#d1d5db",
      "editorCursor.foreground": "#24292e",
      "editor.selectionBackground": "#c8e1ff",
      "editor.lineHighlightBackground": "#f6f8fa",
      "editorWhitespace.foreground": "#e1e4e8",
      "editorIndentGuide.background": "#e1e4e8",
    },
  });
};

export const getMonacoLanguage = (lang: string): string => {
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
  if (!lang) return languageMap["md"];
  return languageMap[lang.toLowerCase()] || lang.toLowerCase();
};

interface MonacoEditorCoreProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height: number;
  className?: string;
}

export const MonacoEditorCore: React.FC<MonacoEditorCoreProps> = ({
  code,
  language,
  onChange,
  readOnly = false,
  height,
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const { mounted } = useApp();
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const themesDefinedRef = useRef(false);

  const editorTheme = resolvedTheme === "dark" ? "dracula" : "dracula-light";
  const initialTheme = resolvedTheme === "dark" ? "vs-dark" : "vs";

  useEffect(() => {
    if (
      editorInstanceRef.current &&
      mounted &&
      resolvedTheme &&
      themesDefinedRef.current
    ) {
      editorInstanceRef.current.updateOptions({ theme: editorTheme });
    }
  }, [editorTheme, mounted, resolvedTheme]);

  if (!mounted || !resolvedTheme) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="animate-pulse bg-default-100"
      />
    );
  }

  return (
    <Editor
      key={`monaco-editor-${readOnly}`}
      className={cn(className, "w-full!")}
      height={`${height}px`}
      language={getMonacoLanguage(language)}
      value={code}
      onChange={(value) => {
        if (!readOnly && onChange) {
          onChange(value || "");
        }
      }}
      onMount={(editorInstance, monaco) => {
        defineCustomThemes(monaco);
        themesDefinedRef.current = true;
        editorInstanceRef.current = editorInstance;
        editorInstance.updateOptions({ theme: editorTheme });
      }}
      theme={initialTheme}
      options={{
        minimap: { enabled: false },
        fontSize: 12,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "off",
        readOnly: readOnly,
        stickyScroll: { enabled: false },
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 4,
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
            enabled: "off",
          },
          links: false,
          colorDecorators: false,
        }),
      }}
    />
  );
};
