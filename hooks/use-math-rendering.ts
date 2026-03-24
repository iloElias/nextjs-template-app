"use client";

import { renderMathInElement } from "@/lib/katex-render";
import { useEffect, useRef } from "react";

/**
 * Hook to enable KaTeX math rendering in an element
 * Automatically renders $...$ as inline math and $$...$$ as display math
 */
export const useMathRendering = (enabled: boolean = true) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Initial render
    const renderMath = () => {
      const editorContent = container.querySelector(".editor-content");
      if (editorContent) {
        renderMathInElement(editorContent as HTMLElement);
      }
    };

    // Render on mount
    renderMath();

    // Watch for changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      // Check if any of the mutations involve text changes
      const hasTextChanges = mutations.some(
        (mutation) =>
          mutation.type === "characterData" ||
          mutation.type === "childList" ||
          (mutation.type === "attributes" &&
            mutation.attributeName === "data-lexical-text"),
      );

      if (hasTextChanges) {
        // Debounce the rendering
        const timeoutId = setTimeout(renderMath, 100);
        return () => clearTimeout(timeoutId);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-lexical-text"],
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return containerRef;
};
