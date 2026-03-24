"use client";

import { useScopedI18n } from "@/locales/client";
import { Button, ButtonGroup, Select, SelectItem } from "@heroui/react";
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
  SidebarMinimalistic,
  SmileCircle,
  Text,
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
import { EmojiPickerButton } from "../emoji/emoji-picker-button";
import { NumberInput } from "../form/number-input";
import { BulleList } from "../icons/bulle-list";
import { NumberedList } from "../icons/numbered-list";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { SUPPORTED_LANGUAGES } from "../monaco-editor/monaco-language-selector";
import { MdxButton } from "./mdx-button";
import { MdxCodeBlockForm } from "./mdx-code-block-form";
import { useMdxEditor } from "./mdx-editor-context";
import { MdxImageForm } from "./mdx-image-form";
import { MdxLinkForm } from "./mdx-link-form";
import { MdxMathForm } from "./mdx-math-form";
import { MdxToolbarPopover } from "./mdx-toolbar-popover";

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
      className="max-w-33 min-w-33"
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

export const HeroSuperscript = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isSuperscript = (currentFormat & 64) !== 0;

  return (
    <MdxButton
      active={isSuperscript}
      onPress={() => applyFormat("superscript")}
      role={tmdx("toolbar.superscript")}
    >
      <span className="text-medium font-semibold text-default-800 italic">
        <span className="text-xl font-medium text-default-800/50">x</span>²
      </span>
    </MdxButton>
  );
};

export const HeroSubscript = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyFormat = usePublisher(applyFormat$);
  const currentFormat = useCellValue(currentFormat$);
  const isSubscript = (currentFormat & 32) !== 0;

  return (
    <MdxButton
      active={isSubscript}
      onPress={() => applyFormat("subscript")}
      role={tmdx("toolbar.subscript")}
    >
      <span className="text-medium font-semibold text-default-800 italic">
        <span className="text-xl font-medium text-default-800/50">x</span>₂
      </span>
    </MdxButton>
  );
};

export const HeroCreateLink = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const activeEditor = useCellValue(activeEditor$);
  const { openLinkDialog, setLinkEdit } = useMdxEditor();

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

  return (
    <MdxButton onPress={handleOpenDialog} role={tmdx("toolbar.link")}>
      <Link />
    </MdxButton>
  );
};

export const HeroCreateLinkModal = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const cancelEdit = usePublisher(cancelLinkEdit$);
  const { linkEdit, isLinkDialogOpen, closeLinkDialog } = useMdxEditor();

  const handleClose = useCallback(
    (cancelled: boolean = true) => {
      const wasEditing = linkEdit?.isEditing === true;
      closeLinkDialog();
      // Only call cancelEdit if we're cancelling (not submitting) an edit
      if (cancelled && wasEditing) {
        cancelEdit();
      }
    },
    [linkEdit, cancelEdit, closeLinkDialog],
  );

  return (
    <Modal
      isOpen={isLinkDialogOpen}
      onClose={() => handleClose(true)}
      size="sm"
      placement="center"
    >
      <ModalContent
        key={linkEdit ? `${linkEdit.isEditing}-${linkEdit.url}` : "new"}
      >
        <ModalHeader>
          {linkEdit?.isEditing ? tmdx("createLink.url") : tmdx("toolbar.link")}
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
  const { openImageDialog, setImageEdit } = useMdxEditor();

  const handleOpenDialog = useCallback(() => {
    setImageEdit({ src: "", altText: "", title: "", isEditing: false });
    openImageDialog();
  }, [openImageDialog, setImageEdit]);

  return (
    <MdxButton onPress={handleOpenDialog} role={tmdx("toolbar.image")}>
      <Gallery />
    </MdxButton>
  );
};

export const HeroInsertImageModal = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const cancelEdit = usePublisher(closeImageDialog$);
  const { imageEdit, isImageDialogOpen, closeImageDialog } = useMdxEditor();

  const handleClose = useCallback(
    (cancelled: boolean = true) => {
      const wasEditing = imageEdit?.isEditing === true;
      closeImageDialog();
      if (cancelled && wasEditing) {
        cancelEdit();
      }
    },
    [cancelEdit, closeImageDialog, imageEdit],
  );

  return (
    <Modal
      isOpen={isImageDialogOpen}
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
  );
};

export const HeroInsertMath = ({
  onPopoverClose,
}: {
  onPopoverClose?: () => void;
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { openMathDialog, setMathEdit } = useMdxEditor();

  const handleOpenDialog = useCallback(() => {
    onPopoverClose?.();
    setMathEdit({ formula: "", mathType: "inline", isEditing: false });
    openMathDialog();
  }, [openMathDialog, setMathEdit, onPopoverClose]);

  return (
    <MdxButton onPress={handleOpenDialog} role={tmdx("toolbar.math")}>
      <span className="text-lg font-medium text-default-800/50 italic">
        f
        <span className="translate-y-1 text-sm font-semibold text-default-800 italic">
          x
        </span>
      </span>
    </MdxButton>
  );
};

export const HeroInsertMathModal = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const { mathEdit, isMathDialogOpen, closeMathDialog } = useMdxEditor();

  return (
    <Modal
      isOpen={isMathDialogOpen}
      onClose={closeMathDialog}
      size="md"
      placement="center"
    >
      <ModalContent
        key={mathEdit ? `${mathEdit.isEditing}-${mathEdit.formula}` : "new"}
      >
        <ModalHeader>{tmdx("toolbar.math")}</ModalHeader>
        <MdxMathForm
          existingFormula={mathEdit?.formula || ""}
          existingType={mathEdit?.mathType || "inline"}
          isEditing={mathEdit?.isEditing || false}
          mathNodeKey={mathEdit?.mathNodeKey}
          onClose={closeMathDialog}
        />
      </ModalContent>
    </Modal>
  );
};

export const HeroInsertTable = ({
  onPopoverClose,
}: {
  onPopoverClose?: () => void;
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { openTableDialog } = useMdxEditor();

  const handleOpen = () => {
    onPopoverClose?.();
    openTableDialog();
  };

  return (
    <MdxButton onPress={handleOpen} role={tmdx("toolbar.table")}>
      <SidebarMinimalistic className="-rotate-90" />
    </MdxButton>
  );
};

export const HeroInsertTableModal = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const insertTable = usePublisher(insertTable$);
  const { isTableDialogOpen, closeTableDialog } = useMdxEditor();
  const [rows, setRows] = useState<number>(3);
  const [columns, setColumns] = useState<number>(3);

  return (
    <Modal
      isOpen={isTableDialogOpen}
      onClose={closeTableDialog}
      size="sm"
      placement="center"
    >
      <ModalContent>
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
              closeTableDialog();
              insertTable({ rows, columns });
            }}
          >
            {tmdx("dialogControls.save")}
          </Button>
          <Button className="flex-1 rounded-xl!" onPress={closeTableDialog}>
            {tmdx("dialogControls.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

export const HeroInsertCodeBlock = ({
  onPopoverClose,
}: {
  onPopoverClose?: () => void;
}) => {
  const tmdx = useScopedI18n("mdx-editor");
  const { openCodeBlockDialog } = useMdxEditor();

  const handleOpen = () => {
    onPopoverClose?.();
    openCodeBlockDialog();
  };

  return (
    <MdxButton onPress={handleOpen} role={tmdx("toolbar.codeBlock")}>
      <CodeSquare />
    </MdxButton>
  );
};

export const HeroInsertCodeBlockModal = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const { isCodeBlockDialogOpen, closeCodeBlockDialog } = useMdxEditor();

  return (
    <Modal
      isOpen={isCodeBlockDialogOpen}
      onClose={closeCodeBlockDialog}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>{tmdx("toolbar.codeBlock")}</ModalHeader>
        <MdxCodeBlockForm onClose={closeCodeBlockDialog} />
      </ModalContent>
    </Modal>
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

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (!activeEditor) return;

      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText(emoji);
        }
      });
    },
    [activeEditor],
  );

  return (
    <EmojiPickerButton
      onEmojiSelect={handleEmojiSelect}
      showSearch={true}
      containerPadding="small"
      placement="bottom"
      offset={8}
      showArrow
      triggerClassName="h-8 bg-default-100 text-default-800! duration-75! hover:bg-default-200"
      trigger={
        <MdxButton role={tmdx("toolbar.emoji")}>
          <SmileCircle />
        </MdxButton>
      }
    />
  );
};

export const HeroListMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");
  const applyListType = usePublisher(applyListType$);
  const currentListType = useCellValue(currentListType$);

  return (
    <MdxToolbarPopover
      trigger={
        <MdxButton role={tmdx("toolbar.listMenu")}>
          <BulleList />
        </MdxButton>
      }
    >
      <ButtonGroup>
        <MdxButton
          active={currentListType === "bullet"}
          onPress={() =>
            applyListType(currentListType === "bullet" ? "" : "bullet")
          }
          role={tmdx("toolbar.bulletedList")}
        >
          <BulleList />
        </MdxButton>
        <MdxButton
          active={currentListType === "number"}
          onPress={() =>
            applyListType(currentListType === "number" ? "" : "number")
          }
          role={tmdx("toolbar.numberedList")}
        >
          <NumberedList />
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
    </MdxToolbarPopover>
  );
};

export const HeroInsertMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");

  return (
    <MdxToolbarPopover
      trigger={
        <MdxButton role={tmdx("toolbar.insertMenu")}>
          <MenuDots weight="BoldDuotone" />
        </MdxButton>
      }
    >
      {(onClose) => (
        <div className="flex flex-row gap-1">
          <ButtonGroup>
            <HeroInsertTable onPopoverClose={onClose} />
            <HeroInsertThematicBreak />
            <HeroInsertCodeBlock onPopoverClose={onClose} />
          </ButtonGroup>
        </div>
      )}
    </MdxToolbarPopover>
  );
};

export const HeroTextFormattingButtons = () => {
  return (
    <ButtonGroup>
      <HeroBold />
      <HeroItalic />
      <HeroUnderline />
      <HeroStrikethrough />
    </ButtonGroup>
  );
};

export const HeroBasicTextFormattingButtons = () => {
  return (
    <ButtonGroup>
      <HeroBold />
      <HeroItalic />
      <HeroUnderline />
    </ButtonGroup>
  );
};

export const HeroScriptButtons = () => {
  return (
    <>
      <ButtonGroup>
        <HeroSuperscript />
        <HeroSubscript />
      </ButtonGroup>
      <HeroInsertMath />
    </>
  );
};

export const Separator: React.FC = () => {
  return <div className="mx-1! h-6 w-px min-w-px bg-default" />;
};

interface ToolbarGroupProps {
  children: React.ReactNode;
  withSeparator?: boolean;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  withSeparator = false,
}) => {
  return (
    <>
      {children}
      {withSeparator && <Separator />}
    </>
  );
};

export const HeroTextFormattingGroup = () => {
  return (
    <ToolbarGroup>
      <HeroTextFormattingButtons />
      <HeroScriptButtons />
      <HeroCode />
    </ToolbarGroup>
  );
};

export const HeroResponsiveToolbarMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");

  return (
    <MdxToolbarPopover
      trigger={
        <MdxButton role={tmdx("toolbar.textFormattingMenu")}>
          <Text />
        </MdxButton>
      }
    >
      <div className="flex flex-row gap-1">
        <HeroTextFormattingButtons />
        <Separator />
        <HeroScriptButtons />
        <Separator />
        <HeroCode />
      </div>
    </MdxToolbarPopover>
  );
};

export const HeroMiscellaneousMenu = () => {
  const tmdx = useScopedI18n("mdx-editor");

  return (
    <MdxToolbarPopover
      trigger={
        <MdxButton role={tmdx("toolbar.miscellaneousMenu")}>
          <Text />
        </MdxButton>
      }
    >
      <div className="flex flex-row gap-1 items-center">
        <HeroStrikethrough />
        <Separator />
        <HeroScriptButtons />
        <Separator />
        <HeroCode />
      </div>
    </MdxToolbarPopover>
  );
};

export const HeroHistoryButtons = () => {
  return (
    <ButtonGroup>
      <HeroUndo />
      <HeroRedo />
    </ButtonGroup>
  );
};

export const HeroLinkImageButtons = () => {
  return (
    <ButtonGroup>
      <HeroCreateLink />
      <HeroInsertImage />
    </ButtonGroup>
  );
};
