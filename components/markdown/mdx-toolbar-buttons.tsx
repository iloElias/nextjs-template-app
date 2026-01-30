"use client";

import {
  usePublisher,
  useCellValue,
  insertImage$,
  insertTable$,
  insertThematicBreak$,
  activeEditor$,
  applyFormat$,
  currentFormat$,
  applyListType$,
  currentListType$,
  viewMode$,
  currentBlockType$,
  convertSelectionToNode$,
  cancelLinkEdit$,
} from "@mdxeditor/editor";
import {
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  AlignVerticalSpacing,
  Card,
  Checklist,
  Code,
  CodeSquare,
  DocumentAdd,
  Gallery,
  Link,
  List,
  ListArrowDownMinimalistic,
  Notes,
  TextBold,
  TextCross,
  TextItalic,
  TextUnderline,
  UndoLeftRound,
  UndoRightRound,
} from "@solar-icons/react";
import { MdxButton } from "./mdx-button";
import { useState, useEffect, useCallback } from "react";
import { Dialogue } from "../dialogue";
import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { NumberInput } from "../form/number-input";
import { Input } from "../form/input";
import { useScopedI18n } from "@/locales/client";
import { MdxLinkForm } from "./mdx-link-form";
import { useMdxEditor } from "./mdx-editor-context";
import { MdxCodeBlockForm } from "./mdx-code-block-form";
import { SUPPORTED_LANGUAGES } from "./language-selector";
import { $isCodeNode } from "@lexical/code";
import { $getSelection, $isRangeSelection } from "lexical";

export const HeroBlockTypeSelect = () => {
  const tmdx = useScopedI18n("mdx-editor");

  const currentBlockType = useCellValue(currentBlockType$);
  const convertSelectionToNode = usePublisher(convertSelectionToNode$);

  const blockTypes = [
    { key: "paragraph", label: tmdx("toolbar.blockTypes.paragraph") },
    { key: "h1", label: tmdx("toolbar.blockTypes.heading", { level: "1" }) },
    { key: "h2", label: tmdx("toolbar.blockTypes.heading", { level: "2" }) },
    { key: "h3", label: tmdx("toolbar.blockTypes.heading", { level: "3" }) },
    { key: "h4", label: tmdx("toolbar.blockTypes.heading", { level: "4" }) },
    { key: "h5", label: tmdx("toolbar.blockTypes.heading", { level: "5" }) },
    { key: "h6", label: tmdx("toolbar.blockTypes.heading", { level: "6" }) },
    { key: "quote", label: tmdx("toolbar.blockTypes.quote") },
    { key: "list", label: tmdx("toolbar.blockTypes.list") },
  ];

  return (
    <Select
      aria-label={tmdx("toolbar.blockTypeSelect.placeholder")}
      size="sm"
      classNames={{ mainWrapper: "min-w-36" }}
      placeholder={tmdx("toolbar.blockTypeSelect.placeholder")}
      disabledKeys={["list"]}
      selectedKeys={new Set([currentBlockType || "paragraph"])}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;

        switch (selected) {
          case "quote":
            convertSelectionToNode(() => $createQuoteNode());
            break;
          case "paragraph":
            convertSelectionToNode(() => $createParagraphNode());
            break;
          case "":
            break;
          default:
            if (selected.startsWith("h")) {
              convertSelectionToNode(() =>
                $createHeadingNode(
                  selected as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
                ),
              );
            }
        }
      }}
    >
      {blockTypes.map((type) => (
        <SelectItem key={type.key}>{type.label}</SelectItem>
      ))}
    </Select>
  );
};

export const HeroUndo = () => {
  const editor = useCellValue(activeEditor$);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    if (editor) {
      return editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      );
    }
  }, [editor]);

  return (
    <MdxButton
      onPress={() => editor?.dispatchCommand(UNDO_COMMAND, undefined)}
      isDisabled={!canUndo}
      role="undo"
    >
      <UndoLeftRound />
    </MdxButton>
  );
};

export const HeroRedo = () => {
  const editor = useCellValue(activeEditor$);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (editor) {
      return editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      );
    }
  }, [editor]);

  return (
    <MdxButton
      onPress={() => editor?.dispatchCommand(REDO_COMMAND, undefined)}
      isDisabled={!canRedo}
      role="redo"
    >
      <UndoRightRound />
    </MdxButton>
  );
};

export const HeroBold = () => {
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isBold = (currentFormat & 1) !== 0;

  return (
    <MdxButton active={isBold} onPress={() => applyFormat("bold")} role="bold">
      <TextBold />
    </MdxButton>
  );
};

export const HeroItalic = () => {
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isItalic = (currentFormat & 2) !== 0;

  return (
    <MdxButton
      active={isItalic}
      onPress={() => applyFormat("italic")}
      role="italic"
    >
      <TextItalic />
    </MdxButton>
  );
};

export const HeroUnderline = () => {
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isUnderline = (currentFormat & 8) !== 0;

  return (
    <MdxButton
      active={isUnderline}
      onPress={() => applyFormat("underline")}
      role="underline"
    >
      <TextUnderline />
    </MdxButton>
  );
};

export const HeroStrikethrough = () => {
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isStrikethrough = (currentFormat & 4) !== 0;

  return (
    <MdxButton
      active={isStrikethrough}
      onPress={() => applyFormat("strikethrough")}
      role="strikethrough"
    >
      <TextCross />
    </MdxButton>
  );
};

export const HeroCode = () => {
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isCode = (currentFormat & 16) !== 0;

  return (
    <MdxButton active={isCode} onPress={() => applyFormat("code")} role="code">
      <Code />
    </MdxButton>
  );
};

export const HeroCreateLink = () => {
  const activeEditor = useCellValue(activeEditor$);
  const cancelEdit = usePublisher(cancelLinkEdit$);
  const {
    linkEdit,
    isLinkDialogOpen,
    openLinkDialog,
    closeLinkDialog,
    setLinkEdit,
  } = useMdxEditor();
  const disclosure = useDisclosure();

  // Sync context state with disclosure state
  useEffect(() => {
    if (isLinkDialogOpen && !disclosure.isOpen) {
      disclosure.onOpen();
    } else if (!isLinkDialogOpen && disclosure.isOpen) {
      disclosure.onClose();
    }
  }, [isLinkDialogOpen, disclosure]);

  const handleOpenDialog = useCallback(() => {
    if (activeEditor) {
      const selection = activeEditor.getEditorState().read(() => {
        const selection = activeEditor._editorState._selection;
        if (selection && selection.getTextContent) {
          return selection.getTextContent();
        }
        return "";
      });
      setLinkEdit({ url: "", title: "", text: selection, isEditing: false });
    }
    openLinkDialog();
  }, [activeEditor, openLinkDialog, setLinkEdit]);

  const handleClose = useCallback(
    (cancelled: boolean = true) => {
      const wasEditing = linkEdit?.isEditing === true;
      closeLinkDialog();
      disclosure.onClose();
      // Only call cancelEdit if we're cancelling (not submitting) an edit
      if (cancelled && wasEditing) {
        cancelEdit();
      }
    },
    [linkEdit, cancelEdit, closeLinkDialog, disclosure],
  );

  return (
    <>
      <Modal
        isOpen={disclosure.isOpen}
        onClose={() => handleClose(true)}
        size="sm"
        placement="center"
      >
        <ModalContent
          key={linkEdit ? `${linkEdit.isEditing}-${linkEdit.url}` : "new"}
        >
          <ModalHeader>
            {linkEdit?.isEditing ? "Edit Link" : "Insert Link"}
          </ModalHeader>
          <MdxLinkForm
            selectedText={linkEdit?.text || ""}
            existingUrl={linkEdit?.url || ""}
            existingTitle={linkEdit?.title || ""}
            isEditing={linkEdit?.isEditing || false}
            onClose={handleClose}
          />
        </ModalContent>
      </Modal>
      <MdxButton onPress={handleOpenDialog} role="createlink">
        <Link />
      </MdxButton>
    </>
  );
};

export const HeroBulletList = () => {
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isBullet = currentListType === "bullet";

  return (
    <MdxButton
      active={isBullet}
      onPress={() => applyListType(isBullet ? "" : "bullet")}
      role="bulletlist"
    >
      <List />
    </MdxButton>
  );
};

export const HeroNumberedList = () => {
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isNumbered = currentListType === "number";

  return (
    <MdxButton
      active={isNumbered}
      onPress={() => applyListType(isNumbered ? "" : "number")}
      role="numberedlist"
    >
      <ListArrowDownMinimalistic />
    </MdxButton>
  );
};

export const HeroCheckList = () => {
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isCheck = currentListType === "check";

  return (
    <MdxButton
      active={isCheck}
      onPress={() => applyListType(isCheck ? "" : "check")}
      role="checklist"
    >
      <Checklist />
    </MdxButton>
  );
};

export const HeroInsertImage = () => {
  const insertImage = usePublisher(insertImage$);

  const disclosure = useDisclosure();

  const [title, setTitle] = useState<string>("");
  const [src, setSrc] = useState<string>("");
  const [altText, setAltText] = useState<string>("");

  return (
    <>
      <Dialogue disclosure={disclosure} size="sm" placement="center">
        <ModalHeader>Inserir imagem</ModalHeader>
        <ModalBody>
          <Input
            label="URL da imagem"
            value={src}
            onValueChange={setSrc}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Texto alternativo"
            value={altText}
            onValueChange={setAltText}
            placeholder="Descrição da imagem"
          />
          <Input
            label="Título"
            value={title}
            onValueChange={setTitle}
            placeholder="Título da imagem"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="flex-1 rounded-xl!"
            onPress={() => {
              disclosure.onClose();
              insertImage({ src, altText, title });
            }}
          >
            Confirm
          </Button>
          <Button className="flex-1 rounded-xl!" onPress={disclosure.onClose}>
            Close
          </Button>
        </ModalFooter>
      </Dialogue>
      <MdxButton onPress={disclosure.onOpen} role="insertimage">
        <Gallery />
      </MdxButton>
    </>
  );
};

export const HeroInsertTable = () => {
  const insertTable = usePublisher(insertTable$);

  const disclosure = useDisclosure();

  const [rows, setRows] = useState<number>(3);
  const [columns, setColumns] = useState<number>(3);

  return (
    <>
      <Dialogue disclosure={disclosure} size="sm" placement="center">
        <ModalHeader>Tamanho da tabela</ModalHeader>
        <ModalBody>
          <NumberInput label="Linhas" value={rows} onValueChange={setRows} />
          <NumberInput
            label="Colunas"
            value={columns}
            onValueChange={setColumns}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="flex-1 rounded-xl!"
            onPress={() => {
              disclosure.onClose();
              insertTable({ rows, columns });
            }}
          >
            Confirm
          </Button>
          <Button className="flex-1 rounded-xl!" onPress={disclosure.onClose}>
            Close
          </Button>
        </ModalFooter>
      </Dialogue>
      <MdxButton onPress={disclosure.onOpen} role="inserttable">
        <Card />
      </MdxButton>
    </>
  );
};

export const HeroInsertThematicBreak = () => {
  const insertBreak = usePublisher(insertThematicBreak$);

  return (
    <MdxButton onPress={() => insertBreak()} role="insertthematicbreak">
      <AlignVerticalSpacing />
    </MdxButton>
  );
};

export const HeroInsertCodeBlock = () => {
  const disclosure = useDisclosure();

  return (
    <>
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        size="md"
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Insert Code Block</ModalHeader>
          <MdxCodeBlockForm onClose={disclosure.onClose} />
        </ModalContent>
      </Modal>
      <MdxButton onPress={disclosure.onOpen} role="insertcodeblock">
        <CodeSquare />
      </MdxButton>
    </>
  );
};

export const HeroRichTextMode = () => {
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "rich-text";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("rich-text")}
      role="rich-text"
    >
      <DocumentAdd />
    </MdxButton>
  );
};

export const HeroDiffMode = () => {
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "diff";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("diff")}
      role="diff"
    >
      <Notes />
    </MdxButton>
  );
};

export const HeroSourceMode = () => {
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "source";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("source")}
      role="source"
    >
      <CodeSquare />
    </MdxButton>
  );
};

export const HeroCodeLanguageSelect = () => {
  const activeEditor = useCellValue(activeEditor$);
  const { setCurrentCodeLanguage } = useMdxEditor();
  const [isInCodeBlock, setIsInCodeBlock] = useState(false);
  const [codeBlockLanguage, setCodeBlockLanguage] = useState("javascript");

  useEffect(() => {
    if (!activeEditor) return;

    const checkCodeBlock = () => {
      activeEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();

          if ($isCodeNode(element)) {
            setIsInCodeBlock(true);
            const lang = element.getLanguage() || "javascript";
            setCodeBlockLanguage(lang);
            setCurrentCodeLanguage(lang);
          } else {
            setIsInCodeBlock(false);
          }
        }
      });
    };

    checkCodeBlock();
    return activeEditor.registerUpdateListener(checkCodeBlock);
  }, [activeEditor, setCurrentCodeLanguage]);

  const handleLanguageChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (keys: any) => {
      const selected = Array.from(keys)[0] as string;
      if (!selected || !activeEditor) return;

      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();

          if ($isCodeNode(element)) {
            element.setLanguage(selected);
            setCodeBlockLanguage(selected);
            setCurrentCodeLanguage(selected);
          }
        }
      });
    },
    [activeEditor, setCurrentCodeLanguage],
  );

  return (
    <Select
      aria-label="Code Language"
      size="sm"
      className="max-w-40"
      placeholder="Language"
      selectedKeys={new Set([codeBlockLanguage])}
      onSelectionChange={handleLanguageChange}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <SelectItem key={lang.key}>{lang.label}</SelectItem>
      ))}
    </Select>
  );
};
