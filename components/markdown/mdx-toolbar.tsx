import { ButtonGroup, cn } from "@heroui/react";
import { useCellValues, viewMode$ } from "@mdxeditor/editor";
import {
  HeroUndo,
  HeroRedo,
  HeroBold,
  HeroItalic,
  HeroUnderline,
  HeroCode,
  HeroCreateLink,
  HeroBulletList,
  HeroNumberedList,
  HeroCheckList,
  HeroRichTextMode,
  HeroDiffMode,
  HeroSourceMode,
  HeroInsertImage,
  HeroInsertTable,
  HeroInsertThematicBreak,
  HeroStrikethrough,
  HeroBlockTypeSelect,
} from "./mdx-toolbar-buttons";
import { useScopedI18n } from "@/locales/client";

const Separator: React.FC = () => {
  return <div className="bg-default mx-1 w-px h-6" />;
};

export const MdxToolbar: React.FC = () => {
  const [viewMode] = useCellValues(viewMode$);

  const tmode = useScopedI18n("mdx-editor.mode");

  return (
    <>
      {viewMode === "rich-text" && (
        <>
          <ButtonGroup>
            <HeroUndo />
            <HeroRedo />
          </ButtonGroup>
          <Separator />
          <HeroBlockTypeSelect />
          <Separator />
          <ButtonGroup>
            <HeroBold />
            <HeroItalic />
            <HeroUnderline />
            <HeroStrikethrough />
          </ButtonGroup>
          <HeroCode />
          <Separator />
          <ButtonGroup>
            <HeroCreateLink />
            <HeroInsertImage />
          </ButtonGroup>
          <Separator />
          <ButtonGroup>
            <HeroBulletList />
            <HeroNumberedList />
            <HeroCheckList />
          </ButtonGroup>
          <Separator />
          <ButtonGroup>
            <HeroInsertTable />
            <HeroInsertThematicBreak />
          </ButtonGroup>
        </>
      )}

      <span className={cn("flex-1", viewMode !== "rich-text" && 'hidden')} />
      <p className="mx-2 min-w-max text-tiny">{tmode(viewMode)}</p>
      <span className={cn("flex-1", viewMode === "rich-text" && 'hidden')} />
      <ButtonGroup>
        <HeroRichTextMode />
        <HeroDiffMode />
        <HeroSourceMode />
      </ButtonGroup>
    </>
  );
};
