"use client";

import { useScopedI18n } from "@/locales/client";
import { Button, ButtonGroup, Card, CardBody } from "@heroui/react";
import { $isImageNode, activeEditor$, useCellValue } from "@mdxeditor/editor";
import { Link, Pen, TrashBin2 } from "@solar-icons/react";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { useMdxEditor } from "./mdx-editor-context";
import { Separator } from "./mdx-toolbar-buttons";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeEditor) return;

    return activeEditor.registerUpdateListener(() => {
      activeEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          setIsSelected(
            selection.getNodes().some((node) => node.getKey() === nodeKey),
          );
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [activeEditor, nodeKey]);

  useEffect(() => {
    if (!isSelected || !activeEditor) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        activeEditor.update(() => $setSelection(null));
      }
    };
    const handleScroll = () => activeEditor.update(() => $setSelection(null));
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isSelected, activeEditor]);

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
    <div
      ref={containerRef}
      className="absolute top-0 right-0 z-10 m-1.5 max-w-[calc(100%-12px)]"
    >
      <Card>
        <CardBody className="flex max-w-full flex-row items-center gap-1 rounded-lg bg-background p-1">
          <a
            href={imageSource}
            title={imageSource}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1.5! flex max-w-xs items-center gap-1 truncate text-primary! hover:underline!"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-4!">
              <Link size={16} />
            </div>
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
    </div>
  );
};
