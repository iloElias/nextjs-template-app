import {inputTheme} from "@/lib/heroui";
import {
  NumberInput as HerouiNumberInput,
  NumberInputProps as HerouiNumberInputProps,
} from "@heroui/react";

export interface NumberInputProps extends HerouiNumberInputProps {
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({...props}) => {
  return <HerouiNumberInput {...(inputTheme as NumberInputProps)} {...props} />;
};
