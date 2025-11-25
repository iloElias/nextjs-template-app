import {selectTheme} from "@/lib/heroui";
import {Select as HerouiSelect, SelectProps as HerouiSelectProps, SelectItem} from "@heroui/react";
import {SelectMultiple, SelectMultipleProps} from "./select-multiple";

export interface SelectOption {
  label: string;
  key: string | number;
  description?: string;
}

export type SelectProps = {
  label?: string;
  items: SelectOption[];
  children?: HerouiSelectProps["children"];
} & Omit<HerouiSelectProps, "items" | "children">;

export const Select: React.FC<SelectProps> = ({children, ...props}) => {
  if (props.multiple === true) {
    return <SelectMultiple {...(selectTheme as SelectMultipleProps)} {...props} />;
  }

  return (
    <HerouiSelect {...(selectTheme as SelectProps)} {...props}>
      {children
        ? children
        : props.items.map((item) => (
            <SelectItem key={item.key} description={item.description}>
              {item.label}
            </SelectItem>
          ))}
    </HerouiSelect>
  );
};
