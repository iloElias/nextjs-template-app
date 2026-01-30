"use client";

import { useState, useEffect } from "react";
import { Button, ButtonGroup, Card, CardBody } from "@heroui/react";
import { Link, Pen, TrashBin2 } from "@solar-icons/react";
import { useScopedI18n } from "@/locales/client";
import { useMdxEditor } from "./mdx-editor-context";
import { activeEditor$, useCellValue, $isImageNode } from "@mdxeditor/editor";
import { $getNodeByKey, $getSelection, $isNodeSelection } from "lexical";
import { Separator } from "./mdx-toolbar";

interface MdxImageEditToolbarProps {
  nodeKey: string;
  imageSource: string;
  initialImagePath: string | null;
  title: string;
  alt: string;
  width?: number | "inherit";
  height?: number | "inherit";
}

export const MdxImageEditToolbar: React.FC<MdxImageEditToolbarProps> = ({
  nodeKey,
  imageSource,
  title,
  alt,
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { setImageEdit, openImageDialog } = useMdxEditor();
  const activeEditor = useCellValue(activeEditor$);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!activeEditor) return;

    return activeEditor.registerUpdateListener(() => {
      activeEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          const isThisImageSelected = nodes.some(
            (node) => node.getKey() === nodeKey,
          );
          setIsSelected(isThisImageSelected);
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [activeEditor, nodeKey]);

  if (!isSelected) {
    return null;
  }

  const handleEdit = () => {
    setImageEdit({
      src: imageSource,
      altText: alt,
      title: title,
      imageNodeKey: nodeKey,
      isEditing: true,
    });
    openImageDialog();
  };

  const handleRemove = () => {
    if (activeEditor) {
      activeEditor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node && $isImageNode(node)) {
          node.remove();
        }
      });
    }
  };

  return (
    <Card className="top-0 right-0 z-10 m-1.5! absolute max-w-[calc(100%-12px)]">
      <CardBody className="max-w-full flex flex-row items-center gap-1 bg-background p-1 rounded-lg">
        <a
          href={imageSource}
          title={imageSource}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 ml-1.5! max-w-xs text-primary! hover:underline! truncate"
          onClick={(e) => e.stopPropagation()}
        >
          <Link size={16} className="min-w-4" />
          <span className="truncate">{imageSource}</span>
        </a>
        <Separator />
        <ButtonGroup>
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onPress={handleEdit}
            aria-label={tmdx("imageEditor.editImage")}
          >
            <Pen />
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            isIconOnly
            onPress={handleRemove}
            aria-label={tmdx("imageEditor.deleteImage")}
          >
            <TrashBin2 />
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};
