"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Code,
  Document,
  Gamepad,
  Home,
  MenuDots,
  Widget,
  Translation,
  Palette,
} from "@solar-icons/react";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Accordion, AccordionGroup } from "@/components/ui/accordion";
import { MenuItem, MenuItemGroup } from "@/components/ui/menu-item";

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export default function NavigationMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const locales = [
    { key: "en", label: "English" },
    { key: "pt-BR", label: "Português (BR)" },
  ];

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

  return (
    <>
      <div className="fixed right-0 bottom-0 z-50 m-2">
        <Button
          color="primary"
          isIconOnly
          size="lg"
          onPress={onOpen}
          className="rounded-full"
        >
          <MenuDots size={24} />
        </Button>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent>
          {(onClose) => (
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
                    <Select
                      aria-label=" "
                      selectedKeys={[currentLocale]}
                      onChange={(e) => {
                        const locale = e.target.value as "en" | "pt-BR";
                        if (locale) {
                          changeLocale(locale);
                        }
                      }}
                      className="flex-1"
                    >
                      {locales.map((locale) => (
                        <SelectItem key={locale.key}>{locale.label}</SelectItem>
                      ))}
                    </Select>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
