import { useScopedI18n } from "@/locales/client";
import { ButtonGroup, cn } from "@heroui/react";
import { useCellValues, viewMode$ } from "@mdxeditor/editor";
import { LinkDialogMonitor } from "./mdx-link-dialog-monitor";
import {
  HeroBlockTypeSelect,
  HeroBold,
  HeroCode,
  HeroCreateLink,
  HeroDiffMode,
  HeroInsertEmoji,
  HeroInsertImage,
  HeroInsertMenu,
  HeroItalic,
  HeroListMenu,
  HeroRedo,
  HeroRichTextMode,
  HeroSourceMode,
  HeroStrikethrough,
  HeroUnderline,
  HeroUndo,
} from "./mdx-toolbar-buttons";

export interface MdxToolbarProps {
  hasPrevioesVersion?: boolean;
}

export const Separator: React.FC = () => {
  return <div className="mx-1! h-6 w-px min-w-px bg-default" />;
};

export const MdxToolbar: React.FC<MdxToolbarProps> = ({
  hasPrevioesVersion,
}) => {
  const [viewMode] = useCellValues(viewMode$);

  const tmdx = useScopedI18n("mdx-editor");

  return (
    <>
      <LinkDialogMonitor />
      {viewMode === "rich-text" && (
        <>
          <ButtonGroup>
            <HeroUndo />
            <HeroRedo />
          </ButtonGroup>
          <Separator />
          <HeroBlockTypeSelect />
          {/* <HeroCodeLanguageSelect /> */}
          <Separator />
          <HeroInsertEmoji />
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
          <HeroListMenu />
          <Separator />
          <HeroInsertMenu />
        </>
      )}
      <span className={cn("flex-1", viewMode !== "rich-text" && "hidden")} />
      <p className="mx-2 min-w-max text-tiny">
        {tmdx(`codeBlock.${viewMode}`)}
      </p>
      <span className={cn("flex-1", viewMode === "rich-text" && "hidden")} />
      <ButtonGroup>
        <HeroRichTextMode />
        {hasPrevioesVersion && <HeroDiffMode />}
        <HeroSourceMode />
      </ButtonGroup>
    </>
  );
};
