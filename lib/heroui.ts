import { heroui } from "@heroui/react";
export default heroui();

export const inputTheme = {
  placeholder: " ",
  labelPlacement: "outside",
  variant: "bordered",
  size: "md",
} as const;

export const selectTheme = {
  placeholder: " ",
  labelPlacement: "outside",
  variant: "bordered",
  size: "md",
} as const;

export const textBgHighlightClasses = "bg-default-100 text-default-700";

export const buttonClasses = {
  [textBgHighlightClasses]: true,
  "hover:bg-default-200": true,
};

export const controlButtonClasses =
  "bg-transparent! text-default-400! data-[hover=true]:bg-default/40! data-[hover=true]:opacity-100!";
