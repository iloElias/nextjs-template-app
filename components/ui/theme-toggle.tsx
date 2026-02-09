import {
  cn,
  ButtonProps as HeroUIButtonProps,
  Spinner,
} from "@heroui/react";
import { useTheme } from "next-themes";
import ThemeUserFeedback from "../ux/theme-user-feedback";
import { useApp } from "@/hooks/use-app";
import { Button } from "../button";

interface ThemeSwitcherProps extends HeroUIButtonProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeSwitcherProps> = ({
  className,
  ...props
}: ThemeSwitcherProps) => {
  const { mounted } = useApp();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button isDisabled isIconOnly {...props}>
        <Spinner size="sm" color="current" />
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        className,
      )}
      onPress={toggleTheme}
      isIconOnly
      {...props}
    >
      <ThemeUserFeedback iconSize={22} />
    </Button>
  );
};
