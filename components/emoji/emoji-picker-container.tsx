"use client";

import { ComponentPropsWithoutRef } from "react";

export interface EmojiPickerContainerProps extends ComponentPropsWithoutRef<"div"> {
  padding?: "none" | "small" | "medium" | "large";
}

export const EmojiPickerContainer: React.FC<EmojiPickerContainerProps> = ({
  className,
  padding = "medium",
  children,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    small: "p-2",
    medium: "p-4",
    large: "p-6",
  };

  return (
    <div
      className={`rounded-lg border border-default-200 bg-content1 shadow-lg ${paddingClasses[padding]} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};
