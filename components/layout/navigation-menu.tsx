"use client";

import { Accordion, AccordionGroup } from "@/components/ui/accordion";
import { MenuItem, MenuItemGroup } from "@/components/ui/menu-item";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useApp } from "@/hooks/use-app";
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import {
  Code,
  Document,
  Gamepad,
  Home,
  Palette,
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
  const { menuOpen, setMenuOpen } = useApp();

  const menuStructure: MenuItem[] = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      key: "layouts",
      label: "Layouts",
      icon: <Widget size={20} />,
      children: [
        {
          key: "dashboard",
          label: "Dashboard Layout",
          href: "/layouts/dashboard",
        },
        {
          key: "normal",
          label: "Normal Layout",
          href: "/layouts/normal",
        },
      ],
    },
    {
      key: "markdown",
      label: "Markdown Editors",
      icon: <Document size={20} />,
      children: [
        {
          key: "markdown-editor",
          label: "Markdown Editor",
          href: "/markdown",
        },
        {
          key: "markdown-table",
          label: "Markdown Table",
          href: "/markdown/table",
        },
      ],
    },
    {
      key: "playground",
      label: "Playground",
      icon: <Gamepad size={20} />,
      children: [
        {
          key: "form",
          label: "Form Playground",
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

  const handleOpenChange = (open: boolean) => {
    setMenuOpen(open);
  };

  return (
    <Drawer isOpen={menuOpen} onOpenChange={handleOpenChange} placement="left">
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Code size={24} />
                <h2 className="text-xl font-semibold">Navigation</h2>
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
                    <span className="text-sm">Theme</span>
                  </div>
                  <ThemeToggle size="sm" />
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => setMenuOpen(false)}
              >
                Close
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
