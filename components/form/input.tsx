import {inputTheme} from "@/lib/heroui";
import {Input as HerouiInput, InputProps as HerouiInputProps} from "@heroui/react";
import { useId } from "react";
import { useForm } from "react-hook-form";

export interface InputProps extends HerouiInputProps {
  label?: string;
}

export const Input: React.FC<InputProps> = ({...props}) => {
  const id = useId();
  const { register } = useForm();
  
  // TODO: Think a way to merge the heroui input props with the react-hook-form register props and make it compatible with zod.
  return <HerouiInput {...(inputTheme as InputProps)} {...props} {...register(props.name ?? props.id ?? id, {  })} />;
};
