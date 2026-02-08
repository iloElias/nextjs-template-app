"use client";

import { useScopedI18n } from "@/locales/client";
import {
  Button,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { $isCodeNode } from "@lexical/code";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  activeEditor$,
  applyFormat$,
  applyListType$,
  cancelLinkEdit$,
  closeImageDialog$,
  convertSelectionToNode$,
  currentBlockType$,
  currentFormat$,
  currentListType$,
  insertTable$,
  insertThematicBreak$,
  useCellValue,
  usePublisher,
  viewMode$,
} from "@mdxeditor/editor";
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
  MenuDots,
  Notes,
  SmileCircle,
  TextBold,
  TextCross,
  TextItalic,
  TextUnderline,
  UndoLeftRound,
  UndoRightRound,
} from "@solar-icons/react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { Dialogue } from "../dialogue";
import { CustomEmojiPicker } from "../emoji-picker/emoji-picker";
import { NumberInput } from "../form/number-input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { SUPPORTED_LANGUAGES } from "./language-selector";
import { MdxButton } from "./mdx-button";
import { MdxCodeBlockForm } from "./mdx-code-block-form";
import { useMdxEditor } from "./mdx-editor-context";
import { MdxImageForm } from "./mdx-image-form";
import { MdxLinkForm } from "./mdx-link-form";

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
      className="min-w-33 max-w-33"
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
  const tmdx = useScopedI18n("mdx-editor");
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
      role={tmdx("toolbar.undo", { shortcut: "Ctrl + Z" })}
    >
      <UndoLeftRound />
    </MdxButton>
  );
};

export const HeroRedo = () => {
  const tmdx = useScopedI18n("mdx-editor");
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
      role={tmdx("toolbar.redo", { shortcut: "Ctrl + Y" })}
    >
      <UndoRightRound />
    </MdxButton>
  );
};

export const HeroBold = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isBold = (currentFormat & 1) !== 0;

  return (
    <MdxButton
      active={isBold}
      onPress={() => applyFormat("bold")}
      role={tmdx("toolbar.bold")}
    >
      <TextBold />
    </MdxButton>
  );
};

export const HeroItalic = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isItalic = (currentFormat & 2) !== 0;

  return (
    <MdxButton
      active={isItalic}
      onPress={() => applyFormat("italic")}
      role={tmdx("toolbar.italic")}
    >
      <TextItalic />
    </MdxButton>
  );
};

export const HeroUnderline = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isUnderline = (currentFormat & 8) !== 0;

  return (
    <MdxButton
      active={isUnderline}
      onPress={() => applyFormat("underline")}
      role={tmdx("toolbar.underline")}
    >
      <TextUnderline />
    </MdxButton>
  );
};

export const HeroStrikethrough = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isStrikethrough = (currentFormat & 4) !== 0;

  return (
    <MdxButton
      active={isStrikethrough}
      onPress={() => applyFormat("strikethrough")}
      role={tmdx("toolbar.strikethrough")}
    >
      <TextCross />
    </MdxButton>
  );
};

export const HeroCode = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isCode = (currentFormat & 16) !== 0;

  return (
    <MdxButton
      active={isCode}
      onPress={() => applyFormat("code")}
      role={tmdx("toolbar.inlineCode")}
    >
      <Code />
    </MdxButton>
  );
};

export const HeroCreateLink = () => {
  const tmdx = useScopedI18n("mdx-editor");
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
            {linkEdit?.isEditing
              ? tmdx("createLink.url")
              : tmdx("toolbar.link")}
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
      <MdxButton onPress={handleOpenDialog} role={tmdx("toolbar.link")}>
        <Link />
      </MdxButton>
    </>
  );
};

export const HeroBulletList = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isBullet = currentListType === "bullet";

  return (
    <MdxButton
      active={isBullet}
      onPress={() => applyListType(isBullet ? "" : "bullet")}
      role={tmdx("toolbar.bulletedList")}
    >
      <List />
    </MdxButton>
  );
};

export const HeroNumberedList = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isNumbered = currentListType === "number";

  return (
    <MdxButton
      active={isNumbered}
      onPress={() => applyListType(isNumbered ? "" : "number")}
      role={tmdx("toolbar.numberedList")}
    >
      <ListArrowDownMinimalistic />
    </MdxButton>
  );
};

export const HeroCheckList = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);
  const isCheck = currentListType === "check";

  return (
    <MdxButton
      active={isCheck}
      onPress={() => applyListType(isCheck ? "" : "check")}
      role={tmdx("toolbar.checkList")}
    >
      <Checklist />
    </MdxButton>
  );
};

export const HeroInsertImage = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const cancelEdit = usePublisher(closeImageDialog$);
  const {
    imageEdit,
    isImageDialogOpen,
    openImageDialog,
    closeImageDialog,
    setImageEdit,
  } = useMdxEditor();
  const disclosure = useDisclosure();

  useEffect(() => {
    if (isImageDialogOpen && !disclosure.isOpen) {
      disclosure.onOpen();
    } else if (!isImageDialogOpen && disclosure.isOpen) {
      disclosure.onClose();
    }
  }, [isImageDialogOpen, disclosure]);

  const handleOpenDialog = useCallback(() => {
    setImageEdit({ src: "", altText: "", title: "", isEditing: false });
    openImageDialog();
  }, [openImageDialog, setImageEdit]);

  const handleClose = useCallback(
    (cancelled: boolean = true) => {
      const wasEditing = imageEdit?.isEditing === true;
      closeImageDialog();
      disclosure.onClose();
      if (cancelled && wasEditing) {
        cancelEdit();
      }
    },
    [cancelEdit, closeImageDialog, disclosure, imageEdit],
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
          key={imageEdit ? `${imageEdit.isEditing}-${imageEdit.src}` : "new"}
        >
          <ModalHeader>{tmdx("uploadImage.dialogTitle")}</ModalHeader>
          <MdxImageForm
            existingSrc={imageEdit?.src || ""}
            existingAltText={imageEdit?.altText || ""}
            existingTitle={imageEdit?.title || ""}
            isEditing={imageEdit?.isEditing || false}
            imageNodeKey={imageEdit?.imageNodeKey}
            onClose={handleClose}
          />
        </ModalContent>
      </Modal>
      <MdxButton onPress={handleOpenDialog} role={tmdx("toolbar.image")}>
        <Gallery />
      </MdxButton>
    </>
  );
};

export const HeroInsertTable = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const insertTable = usePublisher(insertTable$);

  const disclosure = useDisclosure();

  const [rows, setRows] = useState<number>(3);
  const [columns, setColumns] = useState<number>(3);

  return (
    <>
      <Dialogue disclosure={disclosure} size="sm" placement="center">
        <ModalHeader>{tmdx("toolbar.table")}</ModalHeader>
        <ModalBody>
          <NumberInput
            label={tmdx("table.insertRowAbove")}
            value={rows}
            onValueChange={setRows}
          />
          <NumberInput
            label={tmdx("table.columnMenu")}
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
            {tmdx("dialogControls.save")}
          </Button>
          <Button className="flex-1 rounded-xl!" onPress={disclosure.onClose}>
            {tmdx("dialogControls.cancel")}
          </Button>
        </ModalFooter>
      </Dialogue>
      <MdxButton onPress={disclosure.onOpen} role={tmdx("toolbar.table")}>
        <Card />
      </MdxButton>
    </>
  );
};

export const HeroInsertThematicBreak = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const insertBreak = usePublisher(insertThematicBreak$);

  return (
    <MdxButton
      onPress={() => insertBreak()}
      role={tmdx("toolbar.thematicBreak")}
    >
      <AlignVerticalSpacing />
    </MdxButton>
  );
};

export const HeroInsertCodeBlock = () => {
  const tmdx = useScopedI18n("mdx-editor");
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
          <ModalHeader>{tmdx("toolbar.codeBlock")}</ModalHeader>
          <MdxCodeBlockForm onClose={disclosure.onClose} />
        </ModalContent>
      </Modal>
      <MdxButton onPress={disclosure.onOpen} role={tmdx("toolbar.codeBlock")}>
        <CodeSquare />
      </MdxButton>
    </>
  );
};

export const HeroRichTextMode = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "rich-text";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("rich-text")}
      role={tmdx("toolbar.richText")}
    >
      <DocumentAdd />
    </MdxButton>
  );
};

export const HeroDiffMode = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "diff";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("diff")}
      role={tmdx("toolbar.diffMode")}
    >
      <Notes />
    </MdxButton>
  );
};

export const HeroSourceMode = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const viewMode = useCellValue(viewMode$);
  const setViewMode = usePublisher(viewMode$);
  const isActive = viewMode === "source";

  return (
    <MdxButton
      active={isActive}
      onPress={() => setViewMode("source")}
      role={tmdx("toolbar.source")}
    >
      <CodeSquare />
    </MdxButton>
  );
};

export const HeroCodeLanguageSelect = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const activeEditor = useCellValue(activeEditor$);
  const { setCurrentCodeLanguage } = useMdxEditor();
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
            const lang = element.getLanguage() || "javascript";
            setCodeBlockLanguage(lang);
            setCurrentCodeLanguage(lang);
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
      aria-label={tmdx("codeBlock.language")}
      size="sm"
      className="max-w-40"
      placeholder={tmdx("codeBlock.selectLanguage")}
      selectedKeys={new Set([codeBlockLanguage])}
      onSelectionChange={handleLanguageChange}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <SelectItem key={lang.key}>{lang.label}</SelectItem>
      ))}
    </Select>
  );
};

export const HeroInsertEmoji = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const activeEditor = useCellValue(activeEditor$);
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = useCallback(
    ({ emoji }: { emoji: string }) => {
      if (!activeEditor) return;

      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText(emoji);
        }
      });

      setIsOpen(false);
    },
    [activeEditor],
  );

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      offset={10}
    >
      <PopoverTrigger className="h-8 bg-default-100 text-default-800! duration-75! hover:bg-default-200">
        <MdxButton onPress={() => setIsOpen(true)} role={tmdx("toolbar.emoji")}>
          <SmileCircle />
        </MdxButton>
      </PopoverTrigger>
      <PopoverContent>
        <CustomEmojiPicker
          onEmojiSelect={handleEmojiSelect}
          showSearch={true}
          containerPadding="small"
        />
      </PopoverContent>
    </Popover>
  );
};

export const HeroListMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);

  return (
    <Popover placement="bottom" offset={8} showArrow>
      <PopoverTrigger className="h-8 bg-default-100 text-default-800! duration-75! hover:bg-default-200">
        <MdxButton role={tmdx("toolbar.listMenu")}>
          <List />
        </MdxButton>
      </PopoverTrigger>
      <PopoverContent className="rounded-xl p-1">
        <ButtonGroup>
          <MdxButton
            active={currentListType === "bullet"}
            onPress={() =>
              applyListType(currentListType === "bullet" ? "" : "bullet")
            }
            role={tmdx("toolbar.bulletedList")}
          >
            <List />
          </MdxButton>
          <MdxButton
            active={currentListType === "number"}
            onPress={() =>
              applyListType(currentListType === "number" ? "" : "number")
            }
            role={tmdx("toolbar.numberedList")}
          >
            <ListArrowDownMinimalistic />
          </MdxButton>
          <MdxButton
            active={currentListType === "check"}
            onPress={() =>
              applyListType(currentListType === "check" ? "" : "check")
            }
            role={tmdx("toolbar.checkList")}
          >
            <Checklist />
          </MdxButton>
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  );
};

export const HeroInsertMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");

  return (
    <Popover placement="bottom" offset={8} showArrow>
      <PopoverTrigger className="h-8 bg-default-100 text-default-800! duration-75! hover:bg-default-200">
        <MdxButton role={tmdx("toolbar.insertMenu")}>
          <MenuDots weight="BoldDuotone" />
        </MdxButton>
      </PopoverTrigger>
      <PopoverContent className="rounded-xl p-1">
        <ButtonGroup>
          <HeroInsertTable />
          <HeroInsertThematicBreak />
          <HeroInsertCodeBlock />
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  );
};
