import { useCallback } from "react";
import {
  activeEditor$,
  imageUploadHandler$,
  insertImage$,
  useCellValue,
  usePublisher,
  $isImageNode,
} from "@mdxeditor/editor";
import { $getNodeByKey } from "lexical";
import { Button } from "@heroui/react";
import { useScopedI18n } from "@/locales/client";
import { Form } from "../form/form";
import { Input } from "../form/input";
import { ModalBody, ModalFooter } from "../modal";

interface MdxImageFormProps {
  existingSrc?: string;
  existingAltText?: string;
  existingTitle?: string;
  isEditing?: boolean;
  imageNodeKey?: string;
  onClose: (cancelled?: boolean) => void;
}

interface MdxImageFormData {
  src: string;
  altText?: string;
  title?: string;
  file?: File;
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
};

export const MdxImageForm: React.FC<MdxImageFormProps> = ({
  existingSrc = "",
  existingAltText = "",
  existingTitle = "",
  isEditing = false,
  imageNodeKey,
  onClose,
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const insertImage = usePublisher(insertImage$);
  const editor = useCellValue(activeEditor$);
  const imageUploadHandler = useCellValue(imageUploadHandler$);

  const handleSubmit = useCallback(
    async (data: MdxImageFormData) => {
      const formData = data as unknown as FormData;
      const srcValue = String(formData.get("src") || "").trim();
      const altText = String(formData.get("altText") || "").trim();
      const title = String(formData.get("title") || "").trim();
      const fileCandidate = formData.get("file");
      const file = fileCandidate instanceof File && fileCandidate.size > 0 ? fileCandidate : null;

      let resolvedSrc = srcValue;

      if (file) {
        if (imageUploadHandler) {
          resolvedSrc = await imageUploadHandler(file);
        } else {
          resolvedSrc = await readFileAsDataUrl(file);
        }
      }

      if (isEditing && editor && imageNodeKey) {
        editor.update(() => {
          const node = $getNodeByKey(imageNodeKey);
          if (node && $isImageNode(node)) {
            if (resolvedSrc) {
              node.setSrc(resolvedSrc);
            }
            node.setAltText(altText);
            node.setTitle(title || undefined);
          }
        });
        onClose(false);
        return;
      }

      if (file) {
        insertImage({ file, altText, title: title || undefined });
      } else if (resolvedSrc) {
        insertImage({ src: resolvedSrc, altText, title: title || undefined });
      }
      onClose(false);
    },
    [editor, imageNodeKey, imageUploadHandler, insertImage, isEditing, onClose],
  );

  return (
    <Form<MdxImageFormData>
      initialData={{
        src: existingSrc,
        altText: existingAltText,
        title: existingTitle,
      }}
      onSubmit={(_, data) => {
        void handleSubmit(data as MdxImageFormData);
      }}
    >
      <ModalBody>
        <p className="text-default-500 text-tiny">
          {tmdx("uploadImage.uploadInstructions")}
        </p>
        <input
          name="file"
          type="file"
          accept="image/*"
          className="hover:file:bg-default-200 file:bg-default-100 file:mr-4 file:px-3 file:py-2 file:border-0 file:rounded-large w-full text-default-600 text-tiny file:text-default-700 file:text-tiny"
        />
        <p className="mt-2 text-default-500 text-tiny">
          {tmdx("uploadImage.addViaUrlInstructions")}
        </p>
        <Input
          name="src"
          label={tmdx("uploadImage.autoCompletePlaceholder")}
          placeholder="https://example.com/image.jpg"
        />
        <Input
          name="altText"
          label={tmdx("uploadImage.alt")}
          placeholder={tmdx("uploadImage.alt")}
        />
        <Input
          name="title"
          label={tmdx("uploadImage.title")}
          placeholder={tmdx("uploadImage.title")}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" className="flex-1 rounded-xl!">
          {tmdx("dialogControls.save")}
        </Button>
        <Button className="flex-1 rounded-xl!" onPress={() => onClose(true)}>
          {tmdx("dialogControls.cancel")}
        </Button>
      </ModalFooter>
    </Form>
  );
};
