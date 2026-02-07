import { cn, Spinner, SpinnerProps } from "@heroui/react";

export const Loading: React.FC<SpinnerProps> = ({ className, ...props }) => {
  return (
    <Spinner
      className={cn(className, "text-default-500 text-tiny")}
      classNames={{
        label: "text-tiny mt-2",
      }}
      color="current"
      {...props}
    />
  );
};
