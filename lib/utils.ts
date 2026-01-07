import { cn, SlotsToClasses } from "@heroui/react";

export const mergeClassNames = <
  T extends SlotsToClasses<string> | undefined = SlotsToClasses<string>
>(
  baseClassNames: NonNullable<T> | SlotsToClasses<string>,
  classNames?: T
): NonNullable<T> | SlotsToClasses<string> => {
  if (!classNames) {
    return baseClassNames;
  }
  return Object.entries(classNames).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: cn(baseClassNames[key], value),
    };
  }, baseClassNames);
};

export const isEmpty = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: string | number | object | any[]
) => {
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  if (typeof value === "number" && isNaN(value)) {
    return true;
  }
  return false;
};
