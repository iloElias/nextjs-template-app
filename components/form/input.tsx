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
  const { initialData } = useForm();

  return (
    <HerouiInput
      {...(inputTheme as InputProps)}
      defaultValue={initialData?.[props.name as string]}
      {...props}
    />
  );
};
