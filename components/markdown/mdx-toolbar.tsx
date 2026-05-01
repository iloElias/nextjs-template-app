import { useCellValues, viewMode$ } from "@mdxeditor/editor";
import { LinkDialogMonitor } from "./mdx-link-dialog-monitor";
import {
  HeroBlockTypeSelect,
  HeroCreateLinkModal,
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
  HeroTextAlignButtons,
  HeroTextFormattingGroup,
  HeroViewModeSelect,
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

  return (
    <>
      <LinkDialogMonitor />
      <HeroCreateLinkModal />
      <HeroInsertImageModal />
      <HeroInsertMathModal />
      <HeroInsertTableModal />
      <HeroInsertCodeBlockModal />
      <div className="flex w-full items-start gap-1">
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {viewMode === "rich-text" && (
            <>
              <HeroHistoryButtons />
              <Separator />
              <HeroBlockTypeSelect />
              <HeroTextAlignButtons />
              <Separator />
              <HeroTextFormattingGroup />
              <Separator />
              <HeroLinkImageButtons />
              <Separator />
              <HeroInsertEmoji />
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
        </div>
        <HeroViewModeSelect hasDiff={hasPrevioesVersion} />
      </div>
    </>
  );
};
