"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { CustomEmojiPicker } from "./emoji-picker";

export interface EmojiPickerButtonProps {
  onEmojiSelect?: (emoji: string) => void;
  buttonLabel?: string;
  buttonClassName?: string;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  showSearch?: boolean;
  containerPadding?: "none" | "small" | "medium" | "large";
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  showArrow?: boolean;
  /** Custom trigger element. If provided, buttonLabel and button styling props are ignored */
  trigger?: React.ReactNode;
  /** Custom trigger class for PopoverTrigger wrapper */
  triggerClassName?: string;
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
  placement = "bottom",
  offset = 8,
  showArrow = true,
  trigger,
  triggerClassName,
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
      placement={placement}
      offset={offset}
      showArrow={showArrow}
    >
      <PopoverTrigger className={triggerClassName}>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={variant}
            color={color}
            size={size}
            className={buttonClassName}
          >
            {buttonLabel}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <CustomEmojiPicker
          onEmojiSelect={handleEmojiSelect}
          showSearch={showSearch}
          containerPadding={containerPadding}
        />
      </PopoverContent>
    </Popover>
  );
};
