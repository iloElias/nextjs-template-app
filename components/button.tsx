import { buttonClasses, controlButtonClasses } from "@/lib/heroui";
import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
  cn,
} from "@heroui/react";

export interface ButtonProps extends HeroUIButtonProps {
  isControl?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  isControl = false,
  ...props
}) => {
  return (
    <HeroUIButton
      className={cn(
        className,
        isControl
          ? controlButtonClasses
          : (!props.color || props.color === "default") && buttonClasses,
      )}
      {...props}
    />
  );
};
