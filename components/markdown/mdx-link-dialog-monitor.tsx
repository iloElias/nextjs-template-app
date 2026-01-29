"use client";

import { useEffect, useCallback } from "react";
import { useCellValue, usePublisher, linkDialogState$, activeEditor$, cancelLinkEdit$ } from "@mdxeditor/editor";
import { useMdxEditor } from "./mdx-editor-context";
import { $getNodeByKey } from "lexical";
import { $isLinkNode } from "@lexical/link";

export const LinkDialogMonitor: React.FC = () => {
  const linkDialogState = useCellValue(linkDialogState$);
  const activeEditor = useCellValue(activeEditor$);
  const cancelEdit = usePublisher(cancelLinkEdit$);
  const { setLinkPreview, setLinkEdit, openLinkDialog, setRemoveLink } = useMdxEditor();

  const handleRemoveLink = useCallback((linkNodeKey: string) => {
    if (activeEditor) {
      activeEditor.update(() => {
        const node = $getNodeByKey(linkNodeKey);
        if (node && $isLinkNode(node)) {
          const children = node.getChildren();
          children.forEach((child) => {
            node.insertBefore(child);
          });
          node.remove();
        }
      });
      cancelEdit();
    }
  }, [activeEditor, cancelEdit]);

  useEffect(() => {
    setRemoveLink(() => handleRemoveLink);
  }, [handleRemoveLink, setRemoveLink]);

  useEffect(() => {
    if (linkDialogState.type === "preview" && linkDialogState.rectangle) {
      let linkText = "";
      if (activeEditor) {
        activeEditor.getEditorState().read(() => {
          const node = $getNodeByKey(linkDialogState.linkNodeKey);
          if (node && $isLinkNode(node)) {
            linkText = node.getTextContent();
          }
        });
      }
      
      setLinkPreview({
        url: linkDialogState.url,
        title: linkDialogState.title,
        text: linkText,
        linkNodeKey: linkDialogState.linkNodeKey,
        position: {
          top: linkDialogState.rectangle.top + linkDialogState.rectangle.height + 5,
          left: linkDialogState.rectangle.left,
        },
      });
    } else if (linkDialogState.type === "edit") {
      setLinkPreview(null);
      setLinkEdit({
        url: linkDialogState.url || linkDialogState.initialUrl,
        title: linkDialogState.title,
        text: linkDialogState.text,
        isEditing: true,
      });
      openLinkDialog();
    } else {
      setLinkPreview(null);
    }
  }, [linkDialogState, setLinkPreview, setLinkEdit, openLinkDialog, activeEditor]);

  return null;
};
