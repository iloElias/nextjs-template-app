"use client";

import { useScopedI18n } from "@/locales/client";
import {
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { EmojiPicker, useSkinTone } from "frimousse";
import { useLocalStorage } from "ilias-use-storage";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";

type SkinTone =
  | "dark"
  | "light"
  | "medium-dark"
  | "medium-light"
  | "medium"
  | "none";

export interface EmojiPickerSearchProps extends ComponentPropsWithoutRef<
  typeof EmojiPicker.Search
> {
  placeholder?: string;
}

export const EmojiPickerSearch: React.FC<EmojiPickerSearchProps> = ({
  className,
  placeholder,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tmdx = useScopedI18n("mdx-editor");

  const [storedSkinTone, setStoredSkinTone] = useLocalStorage<SkinTone>(
    "emoji-skin-tone",
    "none",
  );
  const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");

  useEffect(() => {
    if (storedSkinTone && storedSkinTone !== skinTone) {
      setSkinTone(storedSkinTone);
    }
  }, [setSkinTone, skinTone, storedSkinTone]);

  const skinColors: Record<SkinTone, string> = {
    none: "bg-[#f8ce23] hover:bg-[#f8ce23]/75!",
    light: "bg-[#f5debd] hover:bg-[#f5debd]/75!",
    "medium-light": "bg-[#dcbc95] hover:bg-[#dcbc95]/75!",
    medium: "bg-[#b68d68] hover:bg-[#b68d68]/75!",
    "medium-dark": "bg-[#a06c44] hover:bg-[#a06c44]/75!",
    dark: "bg-[#6e524a] hover:bg-[#6e524a]/75!",
  };

  const handleSkinToneChange = (tone: SkinTone) => {
    setSkinTone(tone);
    setStoredSkinTone(tone);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <EmojiPicker.Search
        className="min-h-unit-10 relative box-border flex-1 rounded-medium border-medium border-default-200 bg-default-100 px-3 py-2 text-small font-normal text-foreground shadow-none! transition-background duration-150! outline-none group-data-[focus=true]:border-foreground group-data-[focus=true]:bg-default-100 data-[hover=true]:border-default-400 data-[hover=true]:bg-default-200 motion-reduce:transition-none"
        placeholder={placeholder || tmdx("emojiPicker.searchPlaceholder")}
        {...props}
      />
      <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
        <PopoverTrigger>
          <Button
            isIconOnly
            variant="flat"
            size="md"
            className={cn("text-xl", skinColors[skinTone as SkinTone])}
            aria-label={tmdx("emojiPicker.skinToneSelector")}
          >
            {skinToneVariations.find((v) => v.skinTone === skinTone)?.emoji ||
              "👋"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <div className="flex gap-1">
            {skinToneVariations.map(({ skinTone: tone, emoji }) => (
              <Button
                key={tone}
                aria-label={`tone ${tone}`}
                isIconOnly
                variant="light"
                size="sm"
                className={cn(
                  skinColors[tone as SkinTone],
                  skinTone === tone ? "ring-2 ring-primary" : "",
                )}
                onPress={() => handleSkinToneChange(tone as SkinTone)}
              >
                <span className="text-xl">{emoji}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
