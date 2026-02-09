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

export interface HeaderProps {
  shouldHideOnScroll?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  shouldHideOnScroll = true,
}) => {
  const id = useId();

  const { user } = useSession();
  const { mounted } = useApp();

  return (
    <Navbar
      id={id}
      isBordered
      className="w-full border-default-300 bg-default-50 shadow-sm backdrop-blur-sm transition-colors dark:border-default-100"
      shouldHideOnScroll={shouldHideOnScroll}
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
        <LanguageSelect />
        <NavbarItem>
          <ThemeToggle className={cn(user ? "hidden md:flex" : "flex")} />
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
