"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";

/**
 * Ensures JWT + unlocked vault. Waits for session restore before redirecting
 * to /security so a refresh does not bounce while keys re-hydrate.
 */
export function useRequireUnlocked() {
  const { ready: authReady, token, user } = useAuth();
  const { unlocked, sessionReady, refreshStatus } = useVault();
  const router = useRouter();

  useEffect(() => {
    if (!authReady || !sessionReady) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!unlocked) {
      router.replace("/security");
    }
  }, [authReady, sessionReady, token, unlocked, router]);

  useEffect(() => {
    if (!authReady || !token) return;
    void refreshStatus().catch(() => {
      /* package probe is best-effort; unlock gate handles redirects */
    });
  }, [authReady, token, refreshStatus]);

  return {
    ready: authReady && sessionReady && !!token && !!unlocked,
    token,
    user,
    unlocked,
  };
}
