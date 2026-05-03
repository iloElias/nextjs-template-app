import {
  cn,
  Navbar as HeroUINavbar,
  NavbarProps as HeroUINavbarProps,
} from "@heroui/react";

export const Navbar: React.FC<HeroUINavbarProps> = ({
  hidden = false,
  shouldHideOnScroll = true,
  className,
  ...props
}) => {
  return (
    <HeroUINavbar
      isBordered
      shouldHideOnScroll={shouldHideOnScroll}
      hidden={hidden}
      className={cn(
        className,
        "w-full border-default-300 bg-default-50 shadow-sm backdrop-blur-sm transition-colors dark:border-default-100 print:hidden",
      )}
      {...props}
    />
  );
};
