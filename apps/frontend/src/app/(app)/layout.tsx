"use client";

import type { ReactNode } from "react";
import { AppPageLoading, AppShell } from "@/components/app/AppShell";
import { useRequireUnlocked } from "@/hooks/useRequireUnlocked";

/** Persistent shell for authenticated app pages — avoids white flash on nav. */
export default function AppAreaLayout({ children }: { children: ReactNode }) {
  const { ready } = useRequireUnlocked();

  if (!ready) return <AppPageLoading />;

  return <AppShell>{children}</AppShell>;
}
