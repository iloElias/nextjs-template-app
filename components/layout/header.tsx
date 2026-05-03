"use client";

import { useApp } from "@/hooks/use-app";
import { useSession } from "@/hooks/use-session";
import { Image, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useDebounce } from "ilias-use-debounce";
import Link from "next/link";
import React, { useId } from "react";
import { UserNotificationButton } from "../ux/user-notifications-button";
import { MenuOpenerButton } from "./menu-opener-button";
import { Navbar } from "./navbar";

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
  const { mounted, headerDisclosure } = useApp();

  const [debounce] = useDebounce(() => {
    const isHidden =
      document?.getElementById(id)?.getAttribute("data-hidden") === "true";
    const shouldBeOpen = !shouldHideOnScroll ? true : !isHidden;

    if (shouldBeOpen && !headerDisclosure.isOpen) {
      headerDisclosure.onOpen();
    } else if (!shouldBeOpen && headerDisclosure.isOpen) {
      headerDisclosure.onClose();
    }
  }, 1);

  return (
    <Navbar
      id={id}
      onScrollPositionChange={debounce}
      isMenuOpen={true}
      hidden={hidden}
      shouldHideOnScroll={shouldHideOnScroll}
    >
      <NavbarBrand className="flex flex-1 flex-row items-center justify-start gap-2">
        <MenuOpenerButton size="md" />
        <Link href="/">
          <Image src="/favicon.ico" alt="App icon" className="flex size-8" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex" justify="center">
        {mounted && user && <></>}
      </NavbarContent>
      <NavbarContent
        className="flex flex-1 flex-row items-center gap-2"
        justify="end"
      >
        {/* <NavbarItem>
          <LanguageSelect size="sm" className="max-w-44" />
        </NavbarItem>
        <NavbarItem>
          <ThemeToggle
            size="sm"
            className={cn(user ? "hidden md:flex" : "flex")}
          />
        </NavbarItem> */}
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
