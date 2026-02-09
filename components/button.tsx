import { buttonClasses } from "@/lib/heroui";
import { Button as HeroUIButton, ButtonProps, cn } from "@heroui/react";

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <HeroUIButton
      className={cn(
        className,
        (!props.color || props.color === "default") && buttonClasses,
      )}
      {...props}
    />
  );
};
