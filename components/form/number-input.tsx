"use client";

import { inputTheme } from "@/lib/heroui";
import {
  NumberInput as HerouiNumberInput,
  NumberInputProps as HerouiNumberInputProps,
} from "@heroui/react";
import { useForm } from "./form";
import { mergeClassNames } from "@/lib/utils";

export interface NumberInputProps extends HerouiNumberInputProps {
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  classNames,
  ...props
}) => {
  const form = useForm();

  return (
    <HerouiNumberInput
      {...(inputTheme as NumberInputProps)}
      defaultValue={form?.initialData?.[props.name as string]}
      {...props}
      classNames={mergeClassNames({
        inputWrapper: "shadow-xs!",
      }, classNames)}
    />
  );
};
