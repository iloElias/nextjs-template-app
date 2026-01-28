import {
  Button,
  cn,
  ButtonProps as HeroUIButtonProps,
} from "@heroui/react";
import { useTheme } from "next-themes";
import ThemeUserFeedback from "../ux/theme-user-feedback";

interface ThemeSwitcherProps extends HeroUIButtonProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeSwitcherProps> = ({
  className,
  ...props
}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!theme) return null;

  return (
    <Button
      className={cn(
        "bg-default-100 hover:bg-default-200 shadow-sm text-default-700 duration-100",
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

export default ThemeToggle;
