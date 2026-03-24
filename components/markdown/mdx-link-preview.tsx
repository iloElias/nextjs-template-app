"use client";

import { Button, ButtonGroup, Card } from "@heroui/react";
import { Link, Pen, TrashBin2 } from "@solar-icons/react";
import { useEffect, useRef } from "react";
import { useMdxEditor } from "./mdx-editor-context";
import { Separator } from "./mdx-toolbar-buttons";

export const MdxLinkPreview: React.FC = () => {
  const {
    linkPreview,
    setLinkPreview,
    setLinkEdit,
    openLinkDialog,
    isLinkDialogOpen,
  } = useMdxEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  const displayText = linkPreview?.url || linkPreview?.text || "";

  useEffect(() => {
    if (!linkPreview || isLinkDialogOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setLinkPreview(null);
      }
    };
    const handleScroll = () => setLinkPreview(null);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [linkPreview, isLinkDialogOpen, setLinkPreview]);

  if (!linkPreview || isLinkDialogOpen) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: `${linkPreview.position.top}px`,
        left: `${linkPreview.position.left}px`,
        zIndex: 1000,
        maxWidth: "300px",
      }}
    >
      <Card className="flex flex-row items-center gap-1 rounded-lg bg-background/80 p-1 shadow-small backdrop-blur">
        {linkPreview.url ? (
          <a
            href={linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1.5 flex max-w-xs items-center gap-1 truncate text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-4!">
              <Link size={16} />
            </div>
            <span className="truncate">{displayText}</span>
          </a>
        ) : (
          <div className="ml-1.5 flex max-w-xs items-center gap-1 truncate text-primary">
            <Link size={16} />
            <span className="truncate">{displayText}</span>
          </div>
        )}
        <Separator />
        <ButtonGroup>
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onPress={() => {
              setLinkEdit({
                url: linkPreview.url,
                title: linkPreview.title,
                text: linkPreview.text,
                isEditing: true,
              });
              setLinkPreview(null);
              openLinkDialog();
            }}
          >
            <Pen />
          </Button>
          <LinkRemoveButton
            linkNodeKey={linkPreview.linkNodeKey}
            onRemove={() => setLinkPreview(null)}
          />
        </ButtonGroup>
      </Card>
    </div>
  );
};

const LinkRemoveButton: React.FC<{
  linkNodeKey: string;
  onRemove: () => void;
}> = ({ linkNodeKey, onRemove }) => {
  const { removeLink } = useMdxEditor();

  const handleRemoveLink = () => {
    removeLink(linkNodeKey);
    onRemove();
  };

  return (
    <Button
      size="sm"
      variant="flat"
      color="danger"
      isIconOnly
      onPress={handleRemoveLink}
    >
      <TrashBin2 />
    </Button>
  );
};
