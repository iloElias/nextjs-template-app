"use client";

import { useMdxEditor } from "./mdx-editor-context";
import { Button, ButtonGroup, Card } from "@heroui/react";
import { Link, Pen, TrashBin2 } from "@solar-icons/react";
import { Separator } from "./mdx-toolbar";

export const MdxLinkPreview: React.FC = () => {
  const { linkPreview, setLinkPreview, setLinkEdit, openLinkDialog, isLinkDialogOpen } = useMdxEditor();

  if (!linkPreview || isLinkDialogOpen) {
    return null;
  }

  return (
    <Card
      style={{
        position: "fixed",
        top: `${linkPreview.position.top}px`,
        left: `${linkPreview.position.left}px`,
        zIndex: 1000,
      }}
      className="flex flex-row items-center gap-2 p-1 rounded-xl"
    >
      <a
        href={linkPreview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 ml-1.5 max-w-xs text-primary hover:underline truncate"
        onClick={(e) => e.stopPropagation()}
      >
        <Link size={16} />
        <span className="truncate">{linkPreview.url}</span>
      </a>
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
        <LinkRemoveButton linkNodeKey={linkPreview.linkNodeKey} onRemove={() => setLinkPreview(null)} />
      </ButtonGroup>
    </Card>
  );
};

const LinkRemoveButton: React.FC<{ linkNodeKey: string; onRemove: () => void }> = ({ linkNodeKey, onRemove }) => {
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
