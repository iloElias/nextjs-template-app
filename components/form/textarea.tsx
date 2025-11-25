import {inputTheme} from "@/lib/heroui";
import {Textarea as HerouiTextarea, TextAreaProps as HerouiTextAreaProps} from "@heroui/react";

export interface TextAreaProps extends HerouiTextAreaProps {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({...props}) => {
  return <HerouiTextarea {...(inputTheme as TextAreaProps)} {...props} />;
};
