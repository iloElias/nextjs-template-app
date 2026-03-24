"use client";

import { useScopedI18n } from "@/locales/client";
import { Button, Radio, RadioGroup, Textarea } from "@heroui/react";
import { activeEditor$, useCellValue } from "@mdxeditor/editor";
import katex from "katex";
import { $getNodeByKey, $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { ModalBody, ModalFooter } from "../modal";
import {
  $createMathBlockNode,
  $createMathInlineNode,
  $isMathBlockNode,
  $isMathInlineNode,
} from "./math-plugin";

interface MdxMathFormProps {
  existingFormula?: string;
  existingType?: "inline" | "block";
  isEditing?: boolean;
  mathNodeKey?: string;
  onClose?: (cancelled?: boolean) => void;
}

export const MdxMathForm: React.FC<MdxMathFormProps> = ({
  existingFormula = "",
  existingType = "inline",
  isEditing,
  mathNodeKey,
  onClose,
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const activeEditor = useCellValue(activeEditor$);
  const [formula, setFormula] = useState(existingFormula);
  const [mathType, setMathType] = useState<"inline" | "block">(existingType);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current || !formula.trim()) return;
    try {
      katex.render(formula, previewRef.current, {
        displayMode: mathType === "block",
        throwOnError: true,
      });
      previewRef.current.dataset.error = "";
    } catch {
      previewRef.current.dataset.error = "true";
      previewRef.current.textContent = "Invalid LaTeX";
    }
  }, [formula, mathType]);

  const handleSubmit = useCallback(() => {
    if (!activeEditor || !formula.trim()) return;

    activeEditor.update(() => {
      if (isEditing && mathNodeKey) {
        // Mutate the existing node in-place — avoids cross-bundle class identity issues
        const existing = $getNodeByKey(mathNodeKey);
        if ($isMathInlineNode(existing) || $isMathBlockNode(existing)) {
          existing.setFormula(formula);
          return;
        }
      }

      // Inserting a new node
      const newNode =
        mathType === "inline"
          ? $createMathInlineNode(formula)
          : $createMathBlockNode(formula);
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([newNode]);
      }
    });

    onClose?.(false);
  }, [activeEditor, formula, mathType, isEditing, mathNodeKey, onClose]);

  const handleCancel = useCallback(() => {
    onClose?.(true);
  }, [onClose]);

  return (
    <>
      <ModalBody className="gap-4">
        <RadioGroup
          label={tmdx("insertMath.type")}
          value={mathType}
          onValueChange={(value) => setMathType(value as "inline" | "block")}
          orientation="horizontal"
        >
          <Radio value="inline">{tmdx("insertMath.inline")}</Radio>
          <Radio value="block">{tmdx("insertMath.block")}</Radio>
        </RadioGroup>

        <Textarea
          label={tmdx("insertMath.formula")}
          placeholder={tmdx("insertMath.formulaPlaceholder")}
          value={formula}
          onValueChange={setFormula}
          minRows={mathType === "block" ? 4 : 2}
          description={tmdx("insertMath.formulaDescription")}
          classNames={{
            input: "font-mono",
          }}
        />

        {formula && (
          <div className="rounded-lg border border-default-200 bg-default-50 p-3">
            <p className="mb-2 text-tiny text-default-500">
              {tmdx("insertMath.preview")}
            </p>
            <div
              ref={previewRef}
              className="overflow-x-auto text-foreground data-[error=true]:text-sm data-[error=true]:text-danger"
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="flex-1 rounded-xl!"
          onPress={handleSubmit}
          isDisabled={!formula.trim()}
        >
          {tmdx("dialogControls.save")}
        </Button>
        <Button className="flex-1 rounded-xl!" onPress={handleCancel}>
          {tmdx("dialogControls.cancel")}
        </Button>
      </ModalFooter>
    </>
  );
};
