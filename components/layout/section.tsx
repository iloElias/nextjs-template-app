import {cn} from "@heroui/react";

export const Section: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({className, children}) => {
  return <section className={cn("mx-auto px-4 py-8 container", className)}>{children}</section>;
};
