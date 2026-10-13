"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiJson } from "../api/client";
import { logActivity } from "../activity";
import { useAuth } from "../auth/AuthProvider";
import {
  changeVaultPassphrase,
  clearVaultSession,
  restoreVaultSession,
  rotateVaultKeypair,
  saveVaultSession,
  setupVault,
  unlockVault,
  type UnlockedVault,
  type VaultPackagePayload,
} from "../crypto";
import { autolockMs, getAutolock } from "../settings";

type VaultState = {
  unlocked: UnlockedVault | null;
  hasPackage: boolean | null;
  /** False until sessionStorage restore attempt finishes (avoids security redirect flash). */
  sessionReady: boolean;
  setup: (passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<void>;
  changePassphrase: (
    currentPassphrase: string,
    newPassphrase: string,
  ) => Promise<void>;
  rotateKeypair: (passphrase: string) => Promise<number>;
  lock: () => void;
  refreshStatus: () => Promise<void>;
  bumpActivity: () => void;
};

const VaultContext = createContext<VaultState | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { token, user, ready: authReady } = useAuth();
  const [unlocked, setUnlocked] = useState<UnlockedVault | null>(null);
  const [hasPackage, setHasPackage] = useState<boolean | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const lastActive = useRef(Date.now());
  const unlockedRef = useRef(unlocked);
  unlockedRef.current = unlocked;

  const refreshStatus = useCallback(async () => {
    if (!token) {
      setHasPackage(null);
      return;
    }
    try {
      await apiJson<VaultPackagePayload>("/vault", { token });
      setHasPackage(true);
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 404) setHasPackage(false);
      else throw err;
    }
  }, [token]);

  const persistUnlocked = useCallback(
    async (keys: UnlockedVault) => {
      setUnlocked(keys);
      lastActive.current = Date.now();
      if (user?.id) {
        try {
          await saveVaultSession(user.id, keys);
        } catch {
          /* session persistence is best-effort */
        }
      }
    },
    [user?.id],
  );

  const setup = useCallback(
    async (passphrase: string) => {
      if (!token) throw new Error("Not signed in");
      const { payload, unlocked: keys } = await setupVault(passphrase);
      await apiJson("/vault", {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
      });
      setHasPackage(true);
      await persistUnlocked(keys);
    },
    [token, persistUnlocked],
  );

  const unlock = useCallback(
    async (passphrase: string) => {
      if (!token) throw new Error("Not signed in");
      const pkg = await apiJson<VaultPackagePayload>("/vault", { token });
      const keys = await unlockVault(passphrase, pkg);
      setHasPackage(true);
      await persistUnlocked(keys);
      void logActivity(token, "auth", "Vault unlocked");
    },
    [token, persistUnlocked],
  );

  const changePassphrase = useCallback(
    async (currentPassphrase: string, newPassphrase: string) => {
      if (!token) throw new Error("Not signed in");
      const pkg = await apiJson<VaultPackagePayload>("/vault", { token });
      const { payload, unlocked: keys } = await changeVaultPassphrase(
        currentPassphrase,
        newPassphrase,
        pkg,
      );
      await apiJson("/vault?reason=passphrase", {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      await persistUnlocked(keys);
    },
    [token, persistUnlocked],
  );

  const rotateKeypair = useCallback(
    async (passphrase: string) => {
      if (!token) throw new Error("Not signed in");
      const pkg = await apiJson<VaultPackagePayload>("/vault", { token });
      const wrapped = await apiJson<
        { fileId: string; wrappedAesKey: string }[]
      >("/files/wrapped-keys", { token });
      const { payload, unlocked: keys, rewrapped } = await rotateVaultKeypair(
        passphrase,
        pkg,
        wrapped,
      );
      if (rewrapped.length > 0) {
        await apiJson("/files/wrapped-keys", {
          method: "PATCH",
          token,
          body: JSON.stringify({ updates: rewrapped }),
        });
      }
      await apiJson("/vault?reason=rotate", {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      await persistUnlocked(keys);
      return rewrapped.length;
    },
    [token, persistUnlocked],
  );

  const lock = useCallback(() => {
    clearVaultSession();
    setUnlocked(null);
  }, []);

  const bumpActivity = useCallback(() => {
    lastActive.current = Date.now();
  }, []);

  // Re-hydrate unlocked keys after refresh (same tab session).
  // Wait for auth hydration first — never clear sessionStorage while token
  // is briefly null on boot, or refresh always dumps you back on /security.
  useEffect(() => {
    let cancelled = false;

    if (!authReady) {
      setSessionReady(false);
      return;
    }

    if (!token || !user?.id) {
      // Signed out for real (logout already cleared sessionStorage).
      setUnlocked(null);
      setSessionReady(true);
      return;
    }

    setSessionReady(false);
    void (async () => {
      try {
        const keys = await restoreVaultSession(user.id);
        if (!cancelled && keys) {
          setUnlocked(keys);
          lastActive.current = Date.now();
        }
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, token, user?.id]);

  useEffect(() => {
    function onPointer() {
      if (unlockedRef.current) lastActive.current = Date.now();
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onPointer);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onPointer);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!unlockedRef.current) return;
      const ms = autolockMs(getAutolock());
      if (ms == null) return;
      if (Date.now() - lastActive.current >= ms) {
        clearVaultSession();
        setUnlocked(null);
      }
    }, 15_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(
    () => ({
      unlocked,
      hasPackage,
      sessionReady,
      setup,
      unlock,
      changePassphrase,
      rotateKeypair,
      lock,
      refreshStatus,
      bumpActivity,
    }),
    [
      unlocked,
      hasPackage,
      sessionReady,
      setup,
      unlock,
      changePassphrase,
      rotateKeypair,
      lock,
      refreshStatus,
      bumpActivity,
    ],
  );

  return (
    <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}
