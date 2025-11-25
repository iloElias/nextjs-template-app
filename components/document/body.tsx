import {cn} from "@heroui/react";

export const Body: React.FC<React.HTMLAttributes<HTMLBodyElement>> = ({children, ...props}) => {
  return (
    <body className={cn("antialiased")} {...props}>
      {children}
    </body>
  );
};
