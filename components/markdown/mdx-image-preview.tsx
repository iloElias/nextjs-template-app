"use client";

import { Button, ButtonGroup, Card } from "@heroui/react";
import { Pen, TrashBin2 } from "@solar-icons/react";
import { useScopedI18n } from "@/locales/client";
import { useMdxEditor } from "./mdx-editor-context";

export const MdxImagePreview: React.FC = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const {
    imagePreview,
    setImagePreview,
    setImageEdit,
    openImageDialog,
    isImageDialogOpen,
  } = useMdxEditor();

  if (!imagePreview || isImageDialogOpen) {
    return null;
  }

  return (
    <Card
      style={{
        position: "fixed",
        top: `${imagePreview.position.top}px`,
        left: `${imagePreview.position.left}px`,
        zIndex: 1000,
        maxWidth: "150px",
      }}
      className="flex flex-row items-center gap-1 bg-background/80 shadow-small backdrop-blur p-1 rounded-lg"
    >
      <ButtonGroup>
        <Button
          size="sm"
          variant="flat"
          isIconOnly
          onPress={() => {
            setImageEdit({
              src: imagePreview.src,
              altText: imagePreview.altText,
              title: imagePreview.title,
              imageNodeKey: imagePreview.imageNodeKey,
              isEditing: true,
            });
            setImagePreview(null);
            openImageDialog();
          }}
          aria-label={tmdx("imageEditor.editImage")}
        >
          <Pen />
        </Button>
        <ImageRemoveButton
          imageNodeKey={imagePreview.imageNodeKey}
          onRemove={() => setImagePreview(null)}
        />
      </ButtonGroup>
    </Card>
  );
};

const ImageRemoveButton: React.FC<{
  imageNodeKey: string;
  onRemove: () => void;
}> = ({ imageNodeKey, onRemove }) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { removeImage } = useMdxEditor();

  const handleRemoveImage = () => {
    removeImage(imageNodeKey);
    onRemove();
  };

  return (
    <Button
      size="sm"
      variant="flat"
      color="danger"
      isIconOnly
      onPress={handleRemoveImage}
      aria-label={tmdx("imageEditor.deleteImage")}
    >
      <TrashBin2 />
    </Button>
  );
};
