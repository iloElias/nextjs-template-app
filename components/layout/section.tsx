import { cn } from "@heroui/react";

export const Section: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <section className={cn("container mx-auto max-w-5xl px-6 py-4", className)}>
      {children}
    </section>
  );
};
