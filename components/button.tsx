import { buttonClasses, controlButtonClasses } from "@/lib/heroui";
import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
  Tooltip,
  TooltipProps,
  cn,
} from "@heroui/react";

export interface ButtonProps extends HeroUIButtonProps {
  isControl?: boolean;
  tooltip?: string;
  tooltipProps?: TooltipProps;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  isControl = false,
  tooltip,
  tooltipProps,
  ...props
}) => {
  const component = (
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

  if (tooltip) {
    return <Tooltip {...tooltipProps}>{component}</Tooltip>;
  }
  return component;
};
