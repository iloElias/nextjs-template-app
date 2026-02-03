"use client";

import {
  CodeBlockEditorDescriptor,
  useCodeBlockEditorContext,
} from "@mdxeditor/editor";
import { useState, useEffect } from "react";
import { LanguageSelector } from "./language-selector";
import { useMdxEditor } from "./mdx-editor-context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TrashBin2 } from "@solar-icons/react";
import { MdxButton } from "./mdx-button";
import { MonacoEditor } from "../monaco-editor/monaco-editor";

const MonacoEditorComponent: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const { setCode, lexicalNode } = useCodeBlockEditorContext();
  const [editor] = useLexicalComposerContext();
  const { currentCodeLanguage, setCurrentCodeLanguage, readOnly } =
    useMdxEditor();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFocused, setIsFocused] = useState(false);

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

  const header = !readOnly ? (
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
  ) : undefined;

  return (
    <div onFocus={handleFocus} onBlur={handleBlur} tabIndex={-1}>
      <MonacoEditor
        code={code}
        language={currentLanguage}
        onChange={setCode}
        readOnly={readOnly}
        showCopyButton={readOnly}
        showLanguageLabel={readOnly}
        header={header}
        height="auto"
        maxHeight={300}
      />
    </div>
  );
};

export const createMonacoCodeEditorDescriptor =
  (): CodeBlockEditorDescriptor => ({
    match: () => true,
    priority: 1,
    Editor: (props) => (
      <MonacoEditorComponent code={props.code} language={props.language} />
    ),
  });
