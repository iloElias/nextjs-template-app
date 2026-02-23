"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ReactNode, useState } from "react";

export interface MdxToolbarPopoverProps {
  /** The trigger button/element */
  trigger: ReactNode;
  /** The content to display in the popover - can be a function receiving onClose */
  children: ReactNode | ((onClose: () => void) => ReactNode);
  /** Popover placement */
  placement?: "top" | "bottom" | "left" | "right";
  /** Offset from trigger */
  offset?: number;
  /** Show arrow */
  showArrow?: boolean;
  /** Custom trigger class */
  triggerClassName?: string;
}

export const MdxToolbarPopover: React.FC<MdxToolbarPopoverProps> = ({
  trigger,
  children,
  placement = "bottom",
  offset = 8,
  showArrow = true,
  triggerClassName = "h-8 bg-default-100 text-default-800! duration-75! hover:bg-default-200",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement={placement}
      offset={offset}
      showArrow={showArrow}
      shouldCloseOnBlur={false}
    >
      <PopoverTrigger className={triggerClassName}>{trigger}</PopoverTrigger>
      <PopoverContent className="rounded-xl p-1">
        {typeof children === "function" ? children(handleClose) : children}
      </PopoverContent>
    </Popover>
  );
};
