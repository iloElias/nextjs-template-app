import {inputTheme} from "@/lib/heroui";
import {Input as HerouiInput, InputProps as HerouiInputProps} from "@heroui/react";

export interface InputProps extends HerouiInputProps {
  label?: string;
}

export const Input: React.FC<InputProps> = ({...props}) => {
  return <HerouiInput {...(inputTheme as InputProps)} {...props} />;
};
