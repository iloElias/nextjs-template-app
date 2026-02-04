"use client";

import { EmojiPicker as FrimousseEmojiPicker } from "frimousse";
import { ComponentPropsWithoutRef } from "react";
import { EmojiPickerSearch } from "./emoji-picker-search";
import { EmojiPickerContainer } from "./emoji-picker-container";
import { useScopedI18n } from "@/locales/client";

export interface CustomEmojiPickerProps extends ComponentPropsWithoutRef<
  typeof FrimousseEmojiPicker.Root
> {
  showSearch?: boolean;
  containerPadding?: "none" | "small" | "medium" | "large";
}

export const CustomEmojiPicker: React.FC<CustomEmojiPickerProps> = ({
  className,
  showSearch = true,
  containerPadding = "medium",
  columns = 9,
  ...props
}) => {
  const tmdx = useScopedI18n("mdx-editor");

  return (
    <EmojiPickerContainer
      className="bg-transparent shadow-none border-none"
      padding={containerPadding}
    >
      <FrimousseEmojiPicker.Root
        className={`isolate flex h-92 w-fit flex-col ${className || ""}`}
        columns={columns}
        {...props}
      >
        {showSearch && <EmojiPickerSearch />}

        <FrimousseEmojiPicker.Viewport className="relative flex-1 mt-3 outline-none">
          <FrimousseEmojiPicker.Loading className="absolute inset-0 flex justify-center items-center text-default-400 text-sm">
            {tmdx("emojiPicker.loading")}
          </FrimousseEmojiPicker.Loading>

          <FrimousseEmojiPicker.Empty className="absolute inset-0 flex justify-center items-center text-default-400 text-sm">
            {({ search }) =>
              search
                ? tmdx("emojiPicker.noEmojiFoundFor", { search })
                : tmdx("emojiPicker.noEmojiFound")
            }
          </FrimousseEmojiPicker.Empty>

          <FrimousseEmojiPicker.List
            className="pb-1.5 select-none"
            components={{
              CategoryHeader: ({ category, ...headerProps }) => (
                <div
                  className="top-0 sticky bg-content1 p-1 font-medium text-default-500 text-xs tracking-wider"
                  {...headerProps}
                >
                  {category.label}
                </div>
              ),
              Row: ({ children, ...rowProps }) => (
                <div className="px-0 overflow-clip!" {...rowProps}>
                  {children}
                </div>
              ),
              Emoji: ({ emoji, ...emojiProps }) => (
                <button
                  className="flex justify-center items-center data-active:bg-primary/10 hover:bg-default-100 rounded-md data-active:ring-2 data-active:ring-primary/30 size-9 text-xl transition-all"
                  {...emojiProps}
                >
                  {emoji.emoji}
                </button>
              ),
            }}
          />
        </FrimousseEmojiPicker.Viewport>

        <div className="flex justify-between items-center mt-3 pt-3 border-default-200 border-t">
          <FrimousseEmojiPicker.ActiveEmoji>
            {({ emoji }) => (
              <div className="min-h-5 text-default-600 text-sm">
                {emoji ? (
                  <span>
                    <span className="mr-2">{emoji.emoji}</span>
                    {emoji.label}
                  </span>
                ) : (
                  <span className="text-default-400">
                    {tmdx("emojiPicker.hoverToPreview")}
                  </span>
                )}
              </div>
            )}
          </FrimousseEmojiPicker.ActiveEmoji>

          <FrimousseEmojiPicker.SkinToneSelector className="flex justify-center items-center hover:bg-default-100 rounded-md size-8 text-lg transition-colors" />
        </div>
      </FrimousseEmojiPicker.Root>
    </EmojiPickerContainer>
  );
};
