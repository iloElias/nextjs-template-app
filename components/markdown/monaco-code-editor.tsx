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
import { TrashBin2 } from "@solar-icons/react";
import { Button, Tooltip } from "@heroui/react";
import { MdxButton } from "./mdx-button";

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
};

const MonacoEditorComponent: React.FC<{
  code: string;
  language: string;
  readOnly?: boolean;
}> = ({ code, language, readOnly = false }) => {
  const { setCode, lexicalNode } = useCodeBlockEditorContext();
  const [editor] = useLexicalComposerContext();
  const { theme } = useTheme();
  const { currentCodeLanguage, setCurrentCodeLanguage } = useMdxEditor();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFocused, setIsFocused] = useState(false);

  const editorHeight = useMemo(() => {
    const lines = code.split("\n").length;
    const lineHeight = 19;
    const padding = 2;
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
      className="border border-default-200 rounded-lg overflow-hidden"
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {!readOnly && (
        <div className="flex justify-between items-center bg-background px-3 py-2 border-default-200 border-b">
          <LanguageSelector
            value={currentLanguage}
            onChange={handleLanguageChange}
          />
          <MdxButton role="Delete code block" onPress={() => {
            editor.update(() => {
              lexicalNode.remove();
            });
          }}>
            <TrashBin2 />
          </MdxButton>
        </div>
      )}
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <Editor
          key={`monaco-editor-${readOnly}`}
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
          theme={theme === "dark" ? "dracula" : "light"}
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
