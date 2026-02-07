import {
  Button,
  cn,
  ButtonProps as HeroUIButtonProps,
  Spinner,
} from "@heroui/react";
import { useTheme } from "next-themes";
import ThemeUserFeedback from "../ux/theme-user-feedback";
import { useAppContext } from "@/contexts/app-context";

interface ThemeSwitcherProps extends HeroUIButtonProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeSwitcherProps> = ({
  className,
  ...props
}: ThemeSwitcherProps) => {
  const { mounted } = useAppContext();
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
        "bg-default-100 text-default-700 shadow-sm duration-100 hover:bg-default-200",
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
