"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import katex from "katex";
import { TextNode } from "lexical";
import { useEffect } from "react";

/**
 * Lexical plugin to render math formulas using KaTeX
 * Detects $...$ and $$...$$ patterns and renders them
 */
export const MathPlugin = (): null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      const text = textNode.getTextContent();

      // Check if text contains math delimiters
      if (!text.includes("$")) {
        return;
      }

      // Get the parent element
      const element = editor.getElementByKey(textNode.getKey());
      if (!element) {
        return;
      }

      // Don't transform if we're in code blocks
      const closestCode = element.closest("code, pre");
      if (closestCode) {
        return;
      }

      // Try to render math
      try {
        // Match display math $$...$$
        const displayMathRegex = /\$\$([^$]+)\$\$/g;
        let match = displayMathRegex.exec(text);

        if (match) {
          const formula = match[1];
          const span = document.createElement("span");
          span.className = "math-display";
          span.setAttribute("data-formula", formula);
          span.setAttribute("contenteditable", "false");

          katex.render(formula, span, {
            displayMode: true,
            throwOnError: false,
          });

          // Replace the text node with rendered math
          if (element.parentNode) {
            element.parentNode.replaceChild(span, element);
          }
          return;
        }

        // Match inline math $...$
        const inlineMathRegex = /\$([^$\n]+)\$/g;
        match = inlineMathRegex.exec(text);

        if (match) {
          const formula = match[1];
          const span = document.createElement("span");
          span.className = "math-inline";
          span.setAttribute("data-formula", formula);
          span.setAttribute("contenteditable", "false");

          katex.render(formula, span, {
            displayMode: false,
            throwOnError: false,
          });

          // For inline math, we need to handle it differently
          // This is a simplified version - full implementation would need
          // to handle mixed text and math
          if (text === `$${formula}$`) {
            if (element.parentNode) {
              element.parentNode.replaceChild(span, element);
            }
          }
        }
      } catch (error) {
        console.warn("Error rendering math:", error);
      }
    });
  }, [editor]);

  return null;
};
