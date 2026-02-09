import { AppContext, AppContextValue } from "@/providers/app-provider";
import { useContext } from "react";

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
