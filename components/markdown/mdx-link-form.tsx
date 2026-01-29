import {
  insertMarkdown$,
  usePublisher,
  activeEditor$,
  useCellValue,
} from "@mdxeditor/editor";
import { Form } from "../form/form";
import { Input } from "../form/input";
import { Button } from "@heroui/react";
import { ModalBody, ModalFooter } from "../modal";
import { useCallback } from "react";
import { $isLinkNode } from "@lexical/link";
import {
  $getSelection,
  $isRangeSelection,
  $createRangeSelection,
  $setSelection,
} from "lexical";

interface MdxLinkFormProps {
  selectedText: string;
  existingUrl?: string;
  existingTitle?: string;
  isEditing?: boolean;
  onClose: (cancelled?: boolean) => void;
}

interface MdxLink {
  url: string;
  text?: string;
  title?: string;
}

export const MdxLinkForm: React.FC<MdxLinkFormProps> = ({
  selectedText,
  existingUrl = "",
  existingTitle = "",
  isEditing = false,
  onClose,
}) => {
  const insertLink = usePublisher(insertMarkdown$);
  const editor = useCellValue(activeEditor$);

  const makeMdLink = useCallback(
    (url: string, text?: string, title?: string): string => {
      const displayText = text || url;
      return `[${displayText}](${url}${title ? ` "${title}"` : ""})`;
    },
    [],
  );

  return (
    <Form<MdxLink>
      initialData={{
        url: existingUrl,
        text: selectedText,
        title: existingTitle,
      }}
      onSubmit={(e, data) => {
        const formData = data as unknown as FormData;
        const url = formData.get("url") as string;
        const text = formData.get("text") as string;
        const title = formData.get("title") as string;

        if (isEditing && editor) {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();

              for (const node of nodes) {
                const parent = node.getParent();
                if ($isLinkNode(parent)) {
                  const linkSelection = $createRangeSelection();
                  linkSelection.anchor.set(parent.getKey(), 0, "element");
                  linkSelection.focus.set(
                    parent.getKey(),
                    parent.getChildrenSize(),
                    "element",
                  );
                  $setSelection(linkSelection);

                  parent.remove();
                  break;
                } else if ($isLinkNode(node)) {
                  node.remove();
                  break;
                }
              }
            }
          });

          insertLink(makeMdLink(url, text, title));
        } else {
          insertLink(makeMdLink(url, text, title));
        }
        onClose(false);
      }}
    >
      <ModalBody>
        <Input
          name="url"
          label="URL"
          placeholder="https://example.com"
          isRequired
          autoFocus
        />
        <Input name="text" label="Display Text" placeholder="Text to display" />
        <Input name="title" label="Title" placeholder="Title (optional)" />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" className="flex-1 rounded-xl!">
          {isEditing ? "Update Link" : "Insert Link"}
        </Button>
        <Button className="flex-1 rounded-xl!" onPress={() => onClose(true)}>
          Cancel
        </Button>
      </ModalFooter>
    </Form>
  );
};
