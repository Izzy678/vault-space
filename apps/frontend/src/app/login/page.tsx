"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthShell,
  authInputClass,
  authPrimaryBtnClass,
  authLinkClass,
} from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const { login, completeLogin2fa } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [preAuthToken, setPreAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (result.requires2fa) {
        setPreAuthToken(result.preAuthToken);
        setTotpCode("");
        return;
      }
      router.push("/security");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onTotpSubmit(e: FormEvent) {
    e.preventDefault();
    if (!preAuthToken) return;
    setBusy(true);
    setError(null);
    try {
      await completeLogin2fa(preAuthToken, totpCode.trim());
      router.push("/security");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid authenticator code",
      );
    } finally {
      setBusy(false);
    }
  }

  if (preAuthToken) {
    return (
      <AuthShell
        title="Authenticator code"
        subtitle={`Enter the 6-digit code from your app for ${email}, or a recovery code.`}
        footer={
          <button
            type="button"
            className={authLinkClass}
            onClick={() => {
              setPreAuthToken(null);
              setTotpCode("");
              setError(null);
            }}
          >
            Back to password
          </button>
        }
      >
        <form onSubmit={(e) => void onTotpSubmit(e)} className="space-y-5">
          <AuthField label="Code">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className={authInputClass}
              placeholder="123456"
              autoFocus
            />
          </AuthField>
          {error ? (
            <p role="alert" className="text-sm text-app-danger">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className={authPrimaryBtnClass}>
            {busy ? "Verifying…" : "Verify and sign in"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to vaultspace."
      footer={
        <p>
          New to vaultspace?{" "}
          <Link href="/register" className={authLinkClass}>
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => void onPasswordSubmit(e)} className="space-y-5">
        <AuthField label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@example.com"
          />
        </AuthField>
        <AuthField label="Password">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            placeholder="At least 8 characters"
          />
        </AuthField>
        {error ? (
          <p role="alert" className="text-sm text-app-danger">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className={authPrimaryBtnClass}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
