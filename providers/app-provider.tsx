"use client";

import { useDisclosure } from "@heroui/react";
import { createContext, useEffect, useState } from "react";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export interface AppContextValue {
  mounted: boolean;
  headerDisclosure: UseDisclosureReturn;
  menuDisclosure: UseDisclosureReturn;
}

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  const headerDisclosure = useDisclosure();
  const menuDisclosure = useDisclosure();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        mounted,
        headerDisclosure,
        menuDisclosure,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
