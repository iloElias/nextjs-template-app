import { useScopedI18n } from "@/locales/client";
import { ButtonGroup, cn } from "@heroui/react";
import { useCellValues, viewMode$ } from "@mdxeditor/editor";
import { LinkDialogMonitor } from "./mdx-link-dialog-monitor";
import {
  HeroBasicTextFormattingButtons,
  HeroBlockTypeSelect,
  HeroCreateLinkModal,
  HeroDiffMode,
  HeroDownloadButton,
  HeroHistoryButtons,
  HeroInsertCodeBlockModal,
  HeroInsertEmoji,
  HeroInsertImageModal,
  HeroInsertMathModal,
  HeroInsertMenu,
  HeroInsertTableModal,
  HeroLinkImageButtons,
  HeroListMenu,
  HeroMiscellaneousMenu,
  HeroResponsiveToolbarMenu,
  HeroRichTextMode,
  HeroSourceMode,
  HeroTextFormattingGroup,
  Separator,
} from "./mdx-toolbar-buttons";

export interface MdxToolbarProps {
  hasPrevioesVersion?: boolean;
  onDownload?: (format: "markdown" | "html" | "text" | "pdf") => void;
  isDownloading?: boolean;
}

export const MdxToolbar: React.FC<MdxToolbarProps> = ({
  hasPrevioesVersion,
  onDownload,
  isDownloading = false,
}) => {
  const [viewMode] = useCellValues(viewMode$);

  const tmdx = useScopedI18n("mdx-editor");

  return (
    <>
      <LinkDialogMonitor />
      <HeroCreateLinkModal />
      <HeroInsertImageModal />
      <HeroInsertMathModal />
      <HeroInsertTableModal />
      <HeroInsertCodeBlockModal />
      {viewMode === "rich-text" && (
        <>
          <HeroHistoryButtons />
          <Separator />
          <HeroBlockTypeSelect />
          <Separator />
          <HeroInsertEmoji />
          {/* Compact mode - visible on screens < 768px */}
          <div className="md:hidden">
            <HeroResponsiveToolbarMenu />
          </div>
          {/* Medium mode - visible on screens 768px-1023px */}
          <div className="hidden md:contents lg:hidden">
            <HeroBasicTextFormattingButtons />
            <HeroMiscellaneousMenu />
          </div>
          {/* Full mode - visible on screens >= 1024px */}
          <div className="hidden lg:contents">
            <HeroTextFormattingGroup />
            <Separator />
            <HeroLinkImageButtons />
            <Separator />
          </div>
          <HeroListMenu />
          <Separator />
          <HeroInsertMenu />
          {onDownload && (
            <>
              <Separator />
              <HeroDownloadButton
                onDownload={onDownload}
                isDownloading={isDownloading}
              />
            </>
          )}
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
