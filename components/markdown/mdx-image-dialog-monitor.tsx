"use client";

import { useCallback, useEffect } from "react";
import { activeEditor$, $isImageNode, useCellValue } from "@mdxeditor/editor";
import { $getNodeByKey, $getSelection, $isNodeSelection } from "lexical";
import { useMdxEditor } from "./mdx-editor-context";

export const ImageDialogMonitor: React.FC = () => {
  const activeEditor = useCellValue(activeEditor$);
  const { imagePreview, setImagePreview, setRemoveImage, isImageDialogOpen } = useMdxEditor();

  const handleRemoveImage = useCallback(
    (imageNodeKey: string) => {
      if (activeEditor) {
        activeEditor.update(() => {
          const node = $getNodeByKey(imageNodeKey);
          if (node && $isImageNode(node)) {
            node.remove();
          }
        });
      }
    },
    [activeEditor],
  );

  useEffect(() => {
    setRemoveImage(() => handleRemoveImage);
  }, [handleRemoveImage, setRemoveImage]);

  useEffect(() => {
    if (!activeEditor) return;

    return activeEditor.registerUpdateListener(() => {
      if (isImageDialogOpen) {
        setImagePreview(null);
        return;
      }

      activeEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          const imageNode = nodes.find((node) => $isImageNode(node));

          if (imageNode && $isImageNode(imageNode)) {
            const dom = activeEditor.getElementByKey(imageNode.getKey());
            const rect = dom?.getBoundingClientRect();

            if (!rect) {
              setImagePreview(null);
              return;
            }

            // Calculate position with viewport boundaries
            const POPOVER_OFFSET = 6;
            const POPOVER_ESTIMATED_WIDTH = 150;
            const POPOVER_ESTIMATED_HEIGHT = 50;
            
            let top = rect.top + POPOVER_OFFSET;
            let left = rect.right + POPOVER_OFFSET;
            
            // Check right boundary
            if (left + POPOVER_ESTIMATED_WIDTH > window.innerWidth) {
              left = rect.left - POPOVER_ESTIMATED_WIDTH - POPOVER_OFFSET;
            }
            
            // Check left boundary
            if (left < 0) {
              left = POPOVER_OFFSET;
            }
            
            // Check bottom boundary
            if (top + POPOVER_ESTIMATED_HEIGHT > window.innerHeight) {
              top = rect.top - POPOVER_ESTIMATED_HEIGHT - POPOVER_OFFSET;
            }
            
            // Check top boundary
            if (top < 0) {
              top = POPOVER_OFFSET;
            }

            setImagePreview({
              src: imageNode.getSrc(),
              altText: imageNode.getAltText() || "",
              title: imageNode.getTitle(),
              imageNodeKey: imageNode.getKey(),
              position: { top, left },
            });
            return;
          }
        }

        setImagePreview(null);
      });
    });
  }, [activeEditor, isImageDialogOpen, imagePreview, setImagePreview]);

  return null;
};
