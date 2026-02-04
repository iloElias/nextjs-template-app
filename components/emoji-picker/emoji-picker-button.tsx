"use client";

import { useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { CustomEmojiPicker } from "./emoji-picker";

export interface EmojiPickerButtonProps {
  onEmojiSelect?: (emoji: string) => void;
  buttonLabel?: string;
  buttonClassName?: string;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showSearch?: boolean;
  containerPadding?: "none" | "small" | "medium" | "large";
}

export const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onEmojiSelect,
  buttonLabel = "😊 Add Emoji",
  buttonClassName,
  variant = "flat",
  color = "default",
  size = "md",
  showSearch = true,
  containerPadding = "medium",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    onEmojiSelect?.(emoji);
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      offset={10}
    >
      <PopoverTrigger>
        <Button
          variant={variant}
          color={color}
          size={size}
          className={buttonClassName}
        >
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <CustomEmojiPicker
          onEmojiSelect={handleEmojiSelect}
          showSearch={showSearch}
          containerPadding={containerPadding}
        />
      </PopoverContent>
    </Popover>
  );
};
