"use client";

import { ensureFingerprint } from "@/http/auth/fingerprint";
import { useEffect } from "react";

export const FingerprintProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    ensureFingerprint();
  }, []);

  return <>{children}</>;
};
