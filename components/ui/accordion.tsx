"use client";

import { createContext, useContext, useState } from "react";
import { Button, cn } from "@heroui/react";
import { AltArrowDown } from "@solar-icons/react";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

interface AccordionContextType {
  isOpen: boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <AccordionContext.Provider value={{ isOpen }}>
      <div className={cn("rounded-medium ring ring-default/25", className)}>
        <Button
          type="button"
          onPress={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between bg-default/25 px-4 py-3 text-left"
        >
          <div className="flex flex-1 items-center gap-2">{title}</div>
          <AltArrowDown
            size={18}
            className={cn(
              "text-default-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </Button>
        <div
          className={cn(
            "interpolate overflow-hidden transition-all duration-200 ease-in-out",
            isOpen ? "h-auto" : "h-0",
          )}
        >
          <div className="p-2">{children}</div>
        </div>
      </div>
    </AccordionContext.Provider>
  );
}

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordionContext must be used within an Accordion");
  }
  return context;
};

interface AccordionGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionGroup({ children, className }: AccordionGroupProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
