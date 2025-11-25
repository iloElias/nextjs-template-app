import {selectTheme} from "@/lib/heroui";
import {Select as HerouiSelect, SelectProps as HerouiSelectProps, SelectItem} from "@heroui/react";
import {SelectOption} from "./select";

export type SelectMultipleProps = {
  label?: string;
  items: SelectOption[];
  children?: HerouiSelectProps["children"];
} & Omit<HerouiSelectProps, "items" | "children">;

export const SelectMultiple: React.FC<SelectMultipleProps> = ({children, ...props}) => {
  return (
    <HerouiSelect {...(selectTheme as SelectMultipleProps)} {...props} selectionMode="multiple">
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
