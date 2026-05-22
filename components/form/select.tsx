"use client";

import {
  selectTheme,
} from "@/lib/heroui";
import {
  Select as HerouiSelect,
  SelectProps as HerouiSelectProps,
  SelectItem,
} from "@heroui/react";
import { SelectMultiple, SelectMultipleProps } from "./select-multiple";
import { useForm } from "./form";

export interface SelectOption {
  label: string;
  key: string | number;
  description?: string;
}

export type SelectProps = {
  label?: string;
  items: SelectOption[];
  children?: HerouiSelectProps["children"];
  selectItemCustomProps?: Omit<
    React.ComponentProps<typeof SelectItem>,
    "children" | "key" | "description" | "value" | "title"
  >;
} & Omit<HerouiSelectProps, "items" | "children">;

export const Select: React.FC<SelectProps> = ({
  children,
  ...props
}) => {
  const form = useForm();

  if (props.multiple === true) {
    return (
      <SelectMultiple {...(selectTheme as SelectMultipleProps)} {...props} />
    );
  }

  return (
    <HerouiSelect
      {...(selectTheme as SelectProps)}
      defaultSelectedKeys={form?.initialData?.[props.name as string]}
      {...props}
    >
      {children
        ? children
        : props.items.map((item) => (
            <SelectItem
              key={item.key}
              description={item.description}
              {...props.selectItemCustomProps}
            >
              {item.label}
            </SelectItem>
          ))}
    </HerouiSelect>
  );
};
