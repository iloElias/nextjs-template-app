"use client";

import { Accordion, AccordionGroup } from "@/components/ui/accordion";
import { MenuItem, MenuItemGroup } from "@/components/ui/menu-item";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useApp } from "@/hooks/use-app";
import { useScopedI18n } from "@/locales/client";
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import {
  CalendarMark,
  Code,
  Document,
  Gamepad,
  Home,
  Palette,
  SmileCircle,
  Translation,
  Widget,
} from "@solar-icons/react";
import { Button } from "../button";
import { LanguageSelect } from "../ui/language-select";

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const NavigationMenu: React.FC = () => {
  const { menuDisclosure } = useApp();
  const t = useScopedI18n("navigation");

  const menuStructure: MenuItem[] = [
    {
      key: "home",
      label: t("home"),
      href: "/",
      icon: <Home size={20} />,
    },
    {
      key: "calendar",
      label: t("calendar"),
      icon: <CalendarMark size={20} />,
      children: [
        {
          key: "calendar-main",
          label: t("calendar"),
          href: "/calendar",
        },
        {
          key: "calendar-view",
          label: t("calendarView"),
          href: "/calendar/view",
        },
      ],
    },
    {
      key: "emoji-picker",
      label: t("emojiPicker"),
      href: "/emoji-picker",
      icon: <SmileCircle size={20} />,
    },
    {
      key: "layouts",
      label: t("layouts"),
      icon: <Widget size={20} />,
      children: [
        {
          key: "layouts-dashboard",
          label: t("layoutsDashboard"),
          href: "/layouts/dashboard",
        },
        {
          key: "layouts-normal",
          label: t("layoutsNormal"),
          href: "/layouts/normal",
        },
      ],
    },
    {
      key: "markdown-projects",
      label: t("markdownProjects"),
      href: "/m",
      icon: <Document size={20} />,
    },
    {
      key: "markdown",
      label: t("markdownEditors"),
      icon: <Code size={20} />,
      children: [
        {
          key: "markdown-editor",
          label: t("markdownEditor"),
          href: "/markdown",
        },
        {
          key: "markdown-table",
          label: t("markdownTable"),
          href: "/markdown/table",
        },
        {
          key: "markdown-fetch",
          label: t("markdownFetch"),
          href: "/markdown/fetch",
        },
      ],
    },
    {
      key: "playground",
      label: t("playground"),
      icon: <Gamepad size={20} />,
      children: [
        {
          key: "form",
          label: t("formPlayground"),
          href: "/playground/form",
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item.href) {
      return (
        <MenuItem
          key={item.key}
          label={item.label}
          icon={item.icon}
          href={item.href}
        />
      );
    }
    return null;
  };

  const renderAccordionItem = (item: MenuItem) => {
    if (item.children) {
      return (
        <Accordion
          key={item.key}
          title={
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
          }
        >
          <MenuItemGroup>
            {item.children.map((child) => (
              <MenuItem
                key={child.key}
                label={child.label}
                href={child.href}
                size="sm"
              />
            ))}
          </MenuItemGroup>
        </Accordion>
      );
    }
    return null;
  };

  return (
    <Drawer
      isOpen={menuDisclosure.isOpen}
      onOpenChange={menuDisclosure.onOpenChange}
      placement="left"
      className="print:hidden"
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Code size={24} />
                <h2 className="text-xl font-semibold">{t("title")}</h2>
              </div>
            </DrawerHeader>
            <DrawerBody>
              <div className="flex flex-col gap-2">
                {menuStructure
                  .filter((item) => !item.children)
                  .map((item) => renderMenuItem(item))}
                <AccordionGroup>
                  {menuStructure
                    .filter((item) => item.children)
                    .map((item) => renderAccordionItem(item))}
                </AccordionGroup>
              </div>

              <Divider className="mt-4" />

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Translation size={20} />
                  <LanguageSelect className="flex-1" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Palette size={20} />
                    <span className="text-sm">{t("theme")}</span>
                  </div>
                  <ThemeToggle size="sm" />
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button
                color="danger"
                variant="light"
                onPress={menuDisclosure.onClose}
              >
                {t("close")}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
