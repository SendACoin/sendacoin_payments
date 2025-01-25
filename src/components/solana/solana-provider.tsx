"use client";

import { ReactNode } from "react";

interface SolanaProviderProps {
  children: ReactNode;
}

export function SolanaProvider({ children }: SolanaProviderProps) {
  return <>{children}</>;
}
