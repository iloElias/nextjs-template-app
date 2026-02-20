"use client";

import { useApp } from "@/hooks/use-app";
import { useSession } from "@/hooks/use-session";
import {
  cn,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import React, { useId } from "react";
import { LanguageSelect } from "../ui/language-select";
import { ThemeToggle } from "../ui/theme-toggle";
import { UserNotificationButton } from "../ux/user-notifications-button";
import { useDebounce } from "ilias-use-debounce";

export interface HeaderProps {
  hidden?: boolean;
  shouldHideOnScroll?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hidden = false,
  shouldHideOnScroll = true,
}) => {
  const id = useId();

  const { user } = useSession();
  const { mounted, setHeaderOpen } = useApp();

  const [debounce] = useDebounce(() => {
    setHeaderOpen(
      !shouldHideOnScroll
        ? true
        : document?.getElementById(id)?.getAttribute("data-hidden") !== "true",
    );
  }, 1);

  return (
    <Navbar
      id={id}
      isBordered
      className="w-full border-default-300 bg-default-50 shadow-sm backdrop-blur-sm transition-colors dark:border-default-100"
      shouldHideOnScroll={shouldHideOnScroll}
      onScrollPositionChange={debounce}
      isMenuOpen={hidden}
    >
      <NavbarBrand className="flex flex-1 flex-row items-center justify-start gap-4">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="App icon"
            className="flex h-10 w-10 sm:hidden"
          />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex" justify="center">
        {mounted && user && <></>}
      </NavbarContent>
      <NavbarContent
        className="flex flex-1 flex-row items-center gap-2"
        justify="end"
      >
        <LanguageSelect size="sm" className="max-w-44" />
        <NavbarItem>
          <ThemeToggle
            size="sm"
            className={cn(user ? "hidden md:flex" : "flex")}
          />
        </NavbarItem>
        {mounted && user && (
          <NavbarItem className="flex items-center justify-center">
            <UserNotificationButton />
          </NavbarItem>
        )}
        {/* {mounted && user && (
          <NavbarItem className="flex items-center justify-center">
            <UserOptionsButton />
          </NavbarItem>
        )} */}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
