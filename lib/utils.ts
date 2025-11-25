import {cn, SlotsToClasses} from "@heroui/react";

export const mergeClassNames = <
  T extends SlotsToClasses<string> | undefined = SlotsToClasses<string>,
>(
  baseClassNames: NonNullable<T> | SlotsToClasses<string>,
  classNames?: T,
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
