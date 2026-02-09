import { SessionContext } from "@/providers/session-provider";
import { useContext } from "react";

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
};
