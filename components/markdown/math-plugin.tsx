"use client";

import { useScopedI18n } from "@/locales/client";
import { Button, cn } from "@heroui/react";
import {
  addExportVisitor$,
  addImportVisitor$,
  addLexicalNode$,
  addMdastExtension$,
  addSyntaxExtension$,
  addToMarkdownExtension$,
  realmPlugin,
} from "@mdxeditor/editor";
import { Pen, TrashBin2 } from "@solar-icons/react";
import katex from "katex";
import {
  $applyNodeReplacement,
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  DecoratorNode,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import {
  mathFromMarkdown,
  mathToMarkdown,
  type InlineMath,
  type Math as MathBlock,
} from "mdast-util-math";
import { math } from "micromark-extension-math";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMdxEditor } from "./mdx-editor-context";

// ─── Serialized node types ────────────────────────────────────────────────────

export type SerializedMathInlineNode = Spread<
  { formula: string; version: 1 },
  SerializedLexicalNode
>;

export type SerializedMathBlockNode = Spread<
  { formula: string; version: 1 },
  SerializedLexicalNode
>;

// ─── React renderer components ───────────────────────────────────────────────

const MathInlineRenderer: React.FC<{
  formula: string;
  nodeKey: string;
  editor: LexicalEditor;
}> = ({ formula, nodeKey, editor }) => {
  const tmdx = useScopedI18n("mdx-editor");
  const katexRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const { setMathEdit, openMathDialog, readOnly } = useMdxEditor();

  useEffect(() => {
    if (katexRef.current) {
      katex.render(formula, katexRef.current, {
        displayMode: false,
        throwOnError: false,
      });
    }
  }, [formula]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          setIsSelected(
            selection.getNodes().some((n) => n.getKey() === nodeKey),
          );
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [editor, nodeKey]);

  useEffect(() => {
    if (!isSelected) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        editor.update(() => $setSelection(null));
      }
    };
    const handleScroll = () => editor.update(() => $setSelection(null));
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isSelected, editor]);

  const handleEdit = useCallback(() => {
    setMathEdit({
      formula,
      mathType: "inline",
      isEditing: true,
      mathNodeKey: nodeKey,
    });
    openMathDialog();
  }, [formula, nodeKey, setMathEdit, openMathDialog]);

  const handleDelete = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey)?.remove();
    });
  }, [editor, nodeKey]);

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      editor.update(() => {
        const sel = $createNodeSelection();
        sel.add(nodeKey);
        $setSelection(sel);
      });
    },
    [editor, nodeKey],
  );

  return (
    <span
      ref={containerRef}
      className={cn(
        "math-inline relative inline-block",
        isSelected && !readOnly && "rounded-sm ring-2 ring-primary/70",
      )}
      data-formula={formula}
      contentEditable={false}
      onClick={!readOnly ? handleSelect : undefined}
    >
      <span ref={katexRef} />
      {isSelected && !readOnly && (
        <span
          className="absolute bottom-full left-0 z-50 mb-1 flex items-center gap-0.5 rounded-lg border border-default-200 bg-background p-0.5 shadow-small"
          contentEditable={false}
        >
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onPress={handleEdit}
            aria-label={tmdx("insertMath.editMath")}
          >
            <Pen size={14} />
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            isIconOnly
            onPress={handleDelete}
            aria-label={tmdx("insertMath.deleteMath")}
          >
            <TrashBin2 size={14} />
          </Button>
        </span>
      )}
    </span>
  );
};

const MathBlockRenderer: React.FC<{
  formula: string;
  nodeKey: string;
  editor: LexicalEditor;
}> = ({ formula, nodeKey, editor }) => {
  const tmdx = useScopedI18n("mdx-editor");
  const katexRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const { setMathEdit, openMathDialog, readOnly } = useMdxEditor();

  useEffect(() => {
    if (katexRef.current) {
      katex.render(formula, katexRef.current, {
        displayMode: true,
        throwOnError: false,
      });
    }
  }, [formula]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          setIsSelected(
            selection.getNodes().some((n) => n.getKey() === nodeKey),
          );
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [editor, nodeKey]);

  useEffect(() => {
    if (!isSelected) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        editor.update(() => $setSelection(null));
      }
    };
    const handleScroll = () => editor.update(() => $setSelection(null));
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isSelected, editor]);

  const handleEdit = useCallback(() => {
    setMathEdit({
      formula,
      mathType: "block",
      isEditing: true,
      mathNodeKey: nodeKey,
    });
    openMathDialog();
  }, [formula, nodeKey, setMathEdit, openMathDialog]);

  const handleDelete = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey)?.remove();
    });
  }, [editor, nodeKey]);

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      editor.update(() => {
        const sel = $createNodeSelection();
        sel.add(nodeKey);
        $setSelection(sel);
      });
    },
    [editor, nodeKey],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "math-display relative",
        isSelected && !readOnly && "rounded-sm ring-2 ring-primary/70",
      )}
      data-formula={formula}
      contentEditable={false}
      onClick={!readOnly ? handleSelect : undefined}
    >
      <div ref={katexRef} />
      {isSelected && !readOnly && (
        <div
          className="absolute top-0 right-0 z-50 m-1.5 flex items-center gap-0.5 rounded-lg border border-default-200 bg-background p-0.5 shadow-small"
          contentEditable={false}
        >
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onPress={handleEdit}
            aria-label={tmdx("insertMath.editMath")}
          >
            <Pen size={14} />
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            isIconOnly
            onPress={handleDelete}
            aria-label={tmdx("insertMath.deleteMath")}
          >
            <TrashBin2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── MathInlineNode ───────────────────────────────────────────────────────────

export class MathInlineNode extends DecoratorNode<React.ReactElement> {
  __formula: string;

  static getType(): string {
    return "math-inline";
  }

  static clone(node: MathInlineNode): MathInlineNode {
    return new MathInlineNode(node.__formula, node.__key);
  }

  constructor(formula: string, key?: NodeKey) {
    super(key);
    this.__formula = formula;
  }

  static importJSON(data: SerializedMathInlineNode): MathInlineNode {
    return $createMathInlineNode(data.formula);
  }

  exportJSON(): SerializedMathInlineNode {
    return {
      ...super.exportJSON(),
      type: "math-inline",
      version: 1,
      formula: this.__formula,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): boolean {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  getFormula(): string {
    return this.getLatest().__formula;
  }

  setFormula(formula: string): this {
    const self = this.getWritable();
    self.__formula = formula;
    return self;
  }

  decorate(editor: LexicalEditor): React.ReactElement {
    return (
      <MathInlineRenderer
        formula={this.__formula}
        nodeKey={this.__key}
        editor={editor}
      />
    );
  }
}

export function $createMathInlineNode(formula: string): MathInlineNode {
  return $applyNodeReplacement(new MathInlineNode(formula));
}

export function $isMathInlineNode(
  node: LexicalNode | null | undefined,
): node is MathInlineNode {
  return node instanceof MathInlineNode;
}

// ─── MathBlockNode ────────────────────────────────────────────────────────────

export class MathBlockNode extends DecoratorNode<React.ReactElement> {
  __formula: string;

  static getType(): string {
    return "math-block";
  }

  static clone(node: MathBlockNode): MathBlockNode {
    return new MathBlockNode(node.__formula, node.__key);
  }

  constructor(formula: string, key?: NodeKey) {
    super(key);
    this.__formula = formula;
  }

  static importJSON(data: SerializedMathBlockNode): MathBlockNode {
    return $createMathBlockNode(data.formula);
  }

  exportJSON(): SerializedMathBlockNode {
    return {
      ...super.exportJSON(),
      type: "math-block",
      version: 1,
      formula: this.__formula,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): boolean {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  getFormula(): string {
    return this.getLatest().__formula;
  }

  setFormula(formula: string): this {
    const self = this.getWritable();
    self.__formula = formula;
    return self;
  }

  decorate(editor: LexicalEditor): React.ReactElement {
    return (
      <MathBlockRenderer
        formula={this.__formula}
        nodeKey={this.__key}
        editor={editor}
      />
    );
  }
}

export function $createMathBlockNode(formula: string): MathBlockNode {
  return $applyNodeReplacement(new MathBlockNode(formula));
}

export function $isMathBlockNode(
  node: LexicalNode | null | undefined,
): node is MathBlockNode {
  return node instanceof MathBlockNode;
}

// ─── MDXEditor Plugin ─────────────────────────────────────────────────────────

export const mathPlugin = realmPlugin({
  init(realm) {
    // Register micromark syntax + mdast extensions so $...$ and $$...$$ are parsed
    realm.pub(addSyntaxExtension$, math());
    realm.pub(addMdastExtension$, mathFromMarkdown());
    realm.pub(addToMarkdownExtension$, mathToMarkdown());

    // Register the custom Lexical nodes
    realm.pub(addLexicalNode$, [MathInlineNode, MathBlockNode]);

    // mdast → Lexical: inlineMath node
    realm.pub(addImportVisitor$, {
      testNode: "inlineMath",
      visitNode({ mdastNode, actions }) {
        const node = mdastNode as unknown as InlineMath;
        actions.addAndStepInto($createMathInlineNode(node.value));
      },
    });

    // mdast → Lexical: math (block) node
    realm.pub(addImportVisitor$, {
      testNode: "math",
      visitNode({ mdastNode, actions }) {
        const node = mdastNode as unknown as MathBlock;
        actions.addAndStepInto($createMathBlockNode(node.value));
      },
    });

    // Lexical → mdast: MathInlineNode
    realm.pub(addExportVisitor$, {
      testLexicalNode: $isMathInlineNode,
      visitLexicalNode({ lexicalNode, actions }) {
        const formula = (lexicalNode as MathInlineNode).getFormula();
        actions.addAndStepInto("inlineMath", { value: formula }, false);
      },
    });

    // Lexical → mdast: MathBlockNode
    realm.pub(addExportVisitor$, {
      testLexicalNode: $isMathBlockNode,
      visitLexicalNode({ lexicalNode, actions }) {
        const formula = (lexicalNode as MathBlockNode).getFormula();
        actions.addAndStepInto("math", { value: formula }, false);
      },
    });
  },
});
