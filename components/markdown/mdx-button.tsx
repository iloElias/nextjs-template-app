import { useScopedI18n } from "@/locales/client";
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
  const tmdxbutton = useScopedI18n("mdx-editor.buttons");

  return (
    <Tooltip
      isDisabled={!role}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content={role && tmdxbutton(role as any)}
      delay={100}
      closeDelay={0}
    >
      <Button
        size="sm"
        isIconOnly
        className={cn(
          "h-8 bg-default/25 hover:bg-default/50",
          active && "bg-primary/25!",
        )}
        {...props}
      />
    </Tooltip>
  );
};
