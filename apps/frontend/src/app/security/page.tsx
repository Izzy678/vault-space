"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthSecretField,
  AuthShell,
  authPrimaryBtnClass,
} from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";

export default function SecurityPage() {
  const { ready, token, logout } = useAuth();
  const {
    unlocked,
    hasPackage,
    sessionReady,
    setup,
    unlock,
    lock,
    refreshStatus,
  } = useVault();
  const router = useRouter();
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"setup" | "unlock">("setup");

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    void refreshStatus()
      .then(() => undefined)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load vault"),
      );
  }, [ready, token, router, refreshStatus]);

  useEffect(() => {
    if (hasPackage === true) setMode("unlock");
    if (hasPackage === false) setMode("setup");
  }, [hasPackage]);

  useEffect(() => {
    // Already unlocked (or restored from this tab’s session) → leave unlock gate
    if (sessionReady && unlocked) {
      router.replace("/dashboard");
    }
  }, [sessionReady, unlocked, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "setup") {
        if (passphrase.length < 10) {
          throw new Error("Use at least 10 characters for the vault passphrase");
        }
        if (passphrase !== confirm) {
          throw new Error("Passphrases do not match");
        }
        await setup(passphrase);
      } else {
        await unlock(passphrase);
      }
      setPassphrase("");
      setConfirm("");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vault action failed");
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !token || !sessionReady) {
    return (
      <div className="app-root flex min-h-[100dvh] items-center justify-center bg-app-bg text-app-muted">
        Loading…
      </div>
    );
  }

  return (
    <AuthShell
      title={mode === "setup" ? "Create your vault" : "Unlock vault"}
      subtitle={
        mode === "setup"
          ? "Your vault passphrase wraps the RSA private key in the browser. It is never sent to the API. If you lose it, encrypted files cannot be recovered — by design."
          : "Enter your vault passphrase to unwrap your private key in this browser session."
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              lock();
              logout();
              router.push("/login");
            }}
            className="font-medium text-app-muted hover:text-app-text"
          >
            Sign out
          </button>
          {mode === "unlock" ? (
            <p className="text-xs text-app-muted-2">Step 2 of 2 · then dashboard</p>
          ) : (
            <p className="text-xs text-app-muted-2">One-time vault setup</p>
          )}
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthSecretField
          label="Vault passphrase"
          secretLabel="passphrase"
          required
          autoComplete="off"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder={
            mode === "setup" ? "At least 10 characters" : "Your vault passphrase"
          }
        />
        {mode === "setup" ? (
          <AuthSecretField
            label="Confirm passphrase"
            secretLabel="passphrase"
            required
            autoComplete="off"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat passphrase"
          />
        ) : null}
        {error ? <p className="text-sm text-app-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || hasPackage === null}
          className={authPrimaryBtnClass}
        >
          {busy
            ? "Working…"
            : mode === "setup"
              ? "Create vault"
              : "Unlock"}
        </button>
      </form>
    </AuthShell>
  );
}
