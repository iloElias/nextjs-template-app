"use client";

import { inputTheme } from "@/lib/heroui";
import {
  Input as HerouiInput,
  InputProps as HerouiInputProps,
} from "@heroui/react";
import { useForm } from "./form";

export interface InputProps extends HerouiInputProps {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ ...props }) => {
  const form = useForm();

  return (
    <HerouiInput
      {...(inputTheme as InputProps)}
      defaultValue={form?.initialData?.[props.name as string]}
      {...props}
    />
  );
};
