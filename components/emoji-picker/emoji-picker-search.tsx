"use client";

import {
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { EmojiPicker } from "frimousse";
import { ComponentPropsWithoutRef, useState } from "react";
import { useScopedI18n } from "@/locales/client";

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

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <EmojiPicker.Search
        className="box-border relative flex-1 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 shadow-none! px-3 py-2 border-default-200 border-medium data-[hover=true]:border-default-400 group-data-[focus=true]:border-foreground rounded-medium outline-none min-h-unit-10 font-normal text-foreground text-small transition-background motion-reduce:transition-none duration-150!"
        placeholder={placeholder || tmdx("emojiPicker.searchPlaceholder")}
        {...props}
      />
      <EmojiPicker.SkinTone emoji="👋">
        {({ skinTone, setSkinTone, skinToneVariations }) => (
          <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
            <PopoverTrigger>
              <Button 
                isIconOnly 
                variant="flat" 
                size="md"
                aria-label={tmdx("emojiPicker.skinToneSelector")}
              >
                {skinToneVariations.find((v) => v.skinTone === skinTone)
                  ?.emoji || "👋"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="flex gap-1">
                {skinToneVariations.map(({ skinTone: tone, emoji }) => (
                  <Button
                    key={tone}
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => {
                      setSkinTone(
                        tone as
                          | "none"
                          | "light"
                          | "medium-light"
                          | "medium"
                          | "medium-dark"
                          | "dark",
                      );
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-xl">{emoji}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </EmojiPicker.SkinTone>
    </div>
  );
};