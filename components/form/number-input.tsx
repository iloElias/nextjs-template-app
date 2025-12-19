import { inputTheme } from "@/lib/heroui";
import {
  NumberInput as HerouiNumberInput,
  NumberInputProps as HerouiNumberInputProps,
} from "@heroui/react";
import { useForm } from "./form";

export interface NumberInputProps extends HerouiNumberInputProps {
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ ...props }) => {
  const { initialData } = useForm();

  return (
    <HerouiNumberInput
      {...(inputTheme as NumberInputProps)}
      defaultValue={initialData?.[props.name as string]}
      {...props}
    />
  );
};
