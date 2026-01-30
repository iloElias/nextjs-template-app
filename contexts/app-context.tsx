import { createContext, useContext, useEffect, useState } from "react";

export interface AppContextValue {
  mounted: boolean;
}

export interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <AppContext.Provider value={{ mounted }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
