"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { ModalBody, ModalFooter } from "../modal";
import { usePublisher } from "@mdxeditor/editor";
import { insertCodeBlock$ } from "@mdxeditor/editor";
import { LanguageSelector } from "./language-selector";
import { TextArea } from "../form/textarea";
import { useMdxEditor } from "./mdx-editor-context";

interface MdxCodeBlockFormProps {
  onClose: (cancelled?: boolean) => void;
}

export const MdxCodeBlockForm: React.FC<MdxCodeBlockFormProps> = ({
  onClose,
}) => {
  const { currentCodeLanguage, setCurrentCodeLanguage } = useMdxEditor();
  const [language, setLanguage] = useState(currentCodeLanguage);
  const [code, setCode] = useState("");
  const insertCodeBlock = usePublisher(insertCodeBlock$);

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
        <LanguageSelector
          value={language}
          onChange={setLanguage}
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
        <Button
          className="flex-1 rounded-xl!"
          onPress={() => onClose(true)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
