"use client";

import {
  CodeBlockEditorDescriptor,
  useCodeBlockEditorContext,
} from "@mdxeditor/editor";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { LanguageSelector } from "./language-selector";
import { useMdxEditor } from "./mdx-editor-context";

const MonacoEditorComponent: React.FC<{
  code: string;
  language: string;
  readOnly?: boolean;
}> = ({ code, language, readOnly = false }) => {
  const { setCode, lexicalNode } = useCodeBlockEditorContext();
  const { theme } = useTheme();
  const { setCurrentCodeLanguage } = useMdxEditor();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const editorHeight = useMemo(() => {
    const lines = code.split("\n").length;
    const lineHeight = 19;
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

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    setCurrentCodeLanguage(value);
    lexicalNode.getWritable().setLanguage(value);
  };

  return (
    <div className="border border-default-200 dark:border-default-100 rounded-lg overflow-hidden">
      {!readOnly && (
        <div className="flex justify-between items-center bg-default-100 px-3 py-2 border-default-200 dark:border-default-100 border-b">
          <LanguageSelector
            value={currentLanguage}
            onChange={handleLanguageChange}
          />
        </div>
      )}
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <Editor
          height={`${editorHeight}px`}
          language={getMonacoLanguage(currentLanguage)}
          value={code}
          onChange={(value) => {
            if (!readOnly) {
              setCode(value || "");
            }
          }}
          theme={theme === "dark" ? "vs-dark" : "light"}
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
              vertical: "auto",
              horizontal: "auto",
            },
          }}
        />
      </div>
    </div>
  );
};

export const createMonacoCodeEditorDescriptor = (
  readOnly: boolean,
): CodeBlockEditorDescriptor => ({
  match: () => true,
  priority: 1,
  Editor: (props) => (
    <MonacoEditorComponent
      code={props.code}
      language={props.language}
      readOnly={readOnly}
    />
  ),
});
