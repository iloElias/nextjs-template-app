import { Button, ButtonProps, cn, Tooltip } from "@heroui/react";

export interface MdxButtonProps extends ButtonProps {
  active?: boolean;
  role?: string;
}

export const MdxButton: React.FC<MdxButtonProps> = ({
  active,
  role,
  ...props
}) => {
  return (
    <Tooltip
      isDisabled={!role}
      content={role}
      delay={100}
      closeDelay={0}
    >
      <Button
        size="sm"
        isIconOnly
        className={cn(
          "h-8 bg-default-100 hover:bg-default-200 text-default-800! duration-75!",
          active && "bg-primary-200!",
        )}
        {...props}
      />
    </Tooltip>
  );
};
