"use client";

import { Button } from "@heroui/react";
import { insertCodeBlock$, usePublisher } from "@mdxeditor/editor";
import { useState } from "react";
import { LANGUAGE_EXAMPLES } from "../../lib/language-examples";
import { TextArea } from "../form/textarea";
import { ModalBody, ModalFooter } from "../modal";
import { CodeLanguageSelect } from "../monaco-editor/monaco-language-selector";
import { useMdxEditor } from "./mdx-editor-context";

interface MdxCodeBlockFormProps {
  onClose: (cancelled?: boolean) => void;
}

export const MdxCodeBlockForm: React.FC<MdxCodeBlockFormProps> = ({
  onClose,
}) => {
  const { currentCodeLanguage, setCurrentCodeLanguage } = useMdxEditor();
  const [language, setLanguage] = useState(currentCodeLanguage);
  const [code, setCode] = useState(
    currentCodeLanguage ? (LANGUAGE_EXAMPLES[currentCodeLanguage] ?? "") : "",
  );
  const insertCodeBlock = usePublisher(insertCodeBlock$);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(LANGUAGE_EXAMPLES[lang] ?? "");
  };

  const handleSubmit = () => {
    insertCodeBlock({
      code: code,
      language: language,
      meta: "",
    });
    setCurrentCodeLanguage(language);
    onClose(false);
  };

  return (
    <>
      <ModalBody>
        <CodeLanguageSelect
          value={language || ""}
          onChange={handleLanguageChange}
          className="w-full"
        />
        <TextArea
          label="Code"
          value={code}
          onValueChange={setCode}
          placeholder="Enter your code here..."
          minRows={5}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="flex-1 rounded-xl!"
          onPress={handleSubmit}
        >
          Insert
        </Button>
        <Button className="flex-1 rounded-xl!" onPress={() => onClose(true)}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
