"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Whether checkout is open, decided on the server (CHECKOUT_ENABLED) and shared with the order forms. */
const SalesOpen = createContext(false);

export function SalesStatusProvider({ open, children }: { open: boolean; children: ReactNode }) {
  return <SalesOpen.Provider value={open}>{children}</SalesOpen.Provider>;
}

export const useSalesOpen = () => useContext(SalesOpen);
