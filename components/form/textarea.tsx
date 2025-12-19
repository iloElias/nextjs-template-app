import { inputTheme } from "@/lib/heroui";
import {
  Textarea as HerouiTextarea,
  TextAreaProps as HerouiTextAreaProps,
} from "@heroui/react";
import { useForm } from "./form";

export interface TextAreaProps extends HerouiTextAreaProps {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ ...props }) => {
  const { initialData } = useForm();

  return (
    <HerouiTextarea
      {...(inputTheme as TextAreaProps)}
      defaultValue={initialData?.[props.name as string]}
      {...props}
    />
  );
};
