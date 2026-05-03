import { useScopedI18n } from "@/locales/client";
import { Chip } from "@heroui/react";
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

const ModeLabel = ({
  viewMode,
  isPreviewMode,
}: {
  viewMode: string;
  isPreviewMode: boolean;
}) => {
  const tmdx = useScopedI18n("mdx-editor");

  const label = isPreviewMode
    ? tmdx("toolbar.preview")
    : viewMode === "source"
      ? tmdx("toolbar.source")
      : tmdx("toolbar.diffMode");

  return (
    <p className="px-2 py-1.5 text-sm text-default-500">
      {label}
    </p>
  );
};

export interface MdxToolbarProps {
  hasPrevioesVersion?: boolean;
  onDownload?: (format: "markdown" | "html" | "text" | "pdf") => void;
  isDownloading?: boolean;
  isPreviewMode?: boolean;
  onPreviewModeChange?: (value: boolean) => void;
}

export const MdxToolbar: React.FC<MdxToolbarProps> = ({
  hasPrevioesVersion,
  onDownload,
  isDownloading = false,
  isPreviewMode = false,
  onPreviewModeChange,
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
          {(viewMode !== "rich-text" || isPreviewMode) && (
            <ModeLabel viewMode={viewMode} isPreviewMode={isPreviewMode} />
          )}
          {viewMode === "rich-text" && !isPreviewMode && (
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
        <HeroViewModeSelect
          hasDiff={hasPrevioesVersion}
          isPreviewMode={isPreviewMode}
          onPreviewModeChange={onPreviewModeChange}
        />
      </div>
    </>
  );
};
