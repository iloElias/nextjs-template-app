"use client";

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

/**
 * Dracula Dark Syntax Highlighting - matching Monaco
 */
const draculaDarkHighlight = HighlightStyle.define([
  { tag: t.comment, color: "#6272a4", fontStyle: "italic" },
  { tag: [t.keyword, t.operator], color: "#ff79c6" },
  { tag: [t.string, t.regexp], color: "#f1fa8c" },
  { tag: [t.number, t.bool, t.null], color: "#bd93f9" },
  { tag: [t.typeName, t.className, t.tagName], color: "#8be9fd" },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "#50fa7b",
  },
  { tag: [t.variableName, t.propertyName], color: "#f8f8f2" },
  { tag: [t.constant(t.variableName)], color: "#bd93f9" },
  { tag: [t.definition(t.variableName)], color: "#50fa7b" },
  { tag: [t.labelName], color: "#8be9fd" },
  { tag: [t.bracket, t.punctuation, t.separator], color: "#f8f8f2" },
  { tag: [t.attributeName], color: "#50fa7b" },
  { tag: [t.special(t.string)], color: "#f1fa8c" },
]);

/**
 * Dracula Light Syntax Highlighting - matching Monaco
 */
const draculaLightHighlight = HighlightStyle.define([
  { tag: t.comment, color: "#6a737d", fontStyle: "italic" },
  { tag: [t.keyword], color: "#af00db" },
  { tag: [t.string, t.regexp], color: "#22863a" },
  {
    tag: [t.number, t.bool, t.null, t.constant(t.variableName)],
    color: "#005cc5",
  },
  { tag: [t.typeName, t.className, t.tagName], color: "#6f42c1" },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "#005cc5",
  },
  { tag: [t.variableName, t.propertyName], color: "#24292e" },
  { tag: [t.definition(t.variableName)], color: "#005cc5" },
  { tag: [t.labelName], color: "#6f42c1" },
  { tag: [t.operator], color: "#d73a49" },
  { tag: [t.bracket, t.punctuation, t.separator], color: "#24292e" },
  { tag: [t.attributeName], color: "#005cc5" },
  { tag: [t.special(t.string)], color: "#22863a" },
]);

/**
 * CodeMirror Dark Theme - matching Monaco's Dracula theme
 */
const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#282a36",
      color: "#f8f8f2",
      fontSize: "12px",
      fontFamily:
        "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    },
    ".cm-content": {
      caretColor: "#f8f8f2",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#f8f8f2",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "#44475a",
      },
    ".cm-activeLine": {
      backgroundColor: "#44475a75",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#44475a",
    },
    ".cm-gutters": {
      backgroundColor: "#282a36",
      color: "#6272a4",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#44475a75",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      color: "#6272a4",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#44475a",
      border: "none",
      color: "#f8f8f2",
    },
    ".cm-tooltip": {
      backgroundColor: "#282a36",
      border: "1px solid #44475a",
      color: "#f8f8f2",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "#44475a",
        color: "#f8f8f2",
      },
    },
  },
  { dark: true },
);

/**
 * CodeMirror Light Theme - matching Monaco's Dracula Light theme
 */
const lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#ffffff",
      color: "#24292e",
      fontSize: "12px",
      fontFamily:
        "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    },
    ".cm-content": {
      caretColor: "#24292e",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#24292e",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "#c8e1ff",
      },
    ".cm-activeLine": {
      backgroundColor: "#f6f8fa",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#c8e1ff",
    },
    ".cm-gutters": {
      backgroundColor: "#ffffff",
      color: "#d1d5db",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#f6f8fa",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      color: "#d1d5db",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#e1e4e8",
      border: "none",
      color: "#24292e",
    },
    ".cm-tooltip": {
      backgroundColor: "#ffffff",
      border: "1px solid #e1e4e8",
      color: "#24292e",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "#f6f8fa",
        color: "#24292e",
      },
    },
  },
  { dark: false },
);

/**
 * Get CodeMirror extensions for the given theme
 */
export const getCodeMirrorExtensions = (
  theme: "light" | "dark",
): Extension[] => {
  return [
    theme === "dark" ? darkTheme : lightTheme,
    syntaxHighlighting(
      theme === "dark" ? draculaDarkHighlight : draculaLightHighlight,
    ),
  ];
};
