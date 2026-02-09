"use client";

import { normalizeLocale } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { cn, ScrollShadow } from "@heroui/react";
import { EmojiPicker as FrimousseEmojiPicker } from "frimousse";
import { useParams } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { EmojiPickerContainer } from "./emoji-picker-container";
import { EmojiPickerSearch } from "./emoji-picker-search";

export type FrimousseEmojiPickerRoot = typeof FrimousseEmojiPicker.Root;

export type FrimousseEmojiPickerLocales =
  React.ComponentProps<FrimousseEmojiPickerRoot>["locale"];

export interface CustomEmojiPickerProps extends ComponentPropsWithoutRef<FrimousseEmojiPickerRoot> {
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
  const params = useParams();
  const locale = params?.locale as string;

  const tmdx = useScopedI18n("mdx-editor");

  return (
    <EmojiPickerContainer
      className="border-none bg-transparent p-0! shadow-none"
      padding={containerPadding}
    >
      <FrimousseEmojiPicker.Root
        locale={normalizeLocale(locale || "en") as FrimousseEmojiPickerLocales}
        className={`isolate flex h-92 w-fit flex-col ${className || ""}`}
        columns={columns}
        {...props}
      >
        {showSearch && <EmojiPickerSearch />}
        <FrimousseEmojiPicker.Viewport className="relative mt-2 flex-1 outline-none">
          <FrimousseEmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-default-400">
            {tmdx("emojiPicker.loading")}
          </FrimousseEmojiPicker.Loading>
          <FrimousseEmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-default-400">
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
                  className="sticky top-0 bg-content1 p-1 text-xs font-medium tracking-wider text-default-500"
                  {...headerProps}
                >
                  {category.label}
                </div>
              ),
              Row: ({ children, ...rowProps }) => (
                <div className="overflow-visible! px-0" {...rowProps}>
                  {children}
                </div>
              ),
              Emoji: ({ emoji, ...emojiProps }) => (
                <button
                  className={cn(
                    "m-0.5 flex size-8.5 items-center justify-center rounded-large text-xl transition-all duration-75",
                    "data-active:bg-default-100 data-active:ring-2 data-active:ring-primary-400",
                  )}
                  {...emojiProps}
                >
                  {emoji.emoji}
                </button>
              ),
            }}
          />
        </FrimousseEmojiPicker.Viewport>
        <div className="mt-2 flex items-center justify-between border-t border-default-200 pt-2">
          <FrimousseEmojiPicker.ActiveEmoji>
            {({ emoji }) => (
              <div className="min-h-5 text-sm text-default-600">
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

          <FrimousseEmojiPicker.SkinToneSelector className="flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-default-100" />
        </div>
      </FrimousseEmojiPicker.Root>
    </EmojiPickerContainer>
  );
};
