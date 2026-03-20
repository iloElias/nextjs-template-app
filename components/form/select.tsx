import {
  selectTheme,
  textBgHighlightClasses,
} from "@/lib/heroui";
import {
  Select as HerouiSelect,
  SelectProps as HerouiSelectProps,
  SelectItem,
} from "@heroui/react";
import { SelectMultiple, SelectMultipleProps } from "./select-multiple";
import { useForm } from "./form";
import { mergeClassNames } from "@/lib/utils";

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
  classNames,
  ...props
}) => {
  const { initialData } = useForm();

  if (props.multiple === true) {
    return (
      <SelectMultiple {...(selectTheme as SelectMultipleProps)} {...props} />
    );
  }

  return (
    <HerouiSelect
      {...(selectTheme as SelectProps)}
      defaultSelectedKeys={initialData?.[props.name as string]}
      classNames={mergeClassNames(
        {
          trigger:
            (!props.color || props.color === "default") &&
            textBgHighlightClasses,
        },
        classNames,
      )}
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
