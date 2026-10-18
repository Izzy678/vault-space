"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthSecretField,
  AuthShell,
  AuthNotice,
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
        stage="verify"
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
        <form onSubmit={(e) => void onTotpSubmit(e)} className="space-y-5" aria-label="Verify sign-in" aria-busy={busy}>
          <AuthField label="Code">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoCapitalize="none"
              spellCheck={false}
              aria-describedby={error ? "verify-error" : undefined}
              aria-invalid={Boolean(error)}
              required
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className={authInputClass}
              placeholder="123456"
              autoFocus
            />
          </AuthField>
          {error ? (
            <p id="verify-error" role="alert" className="text-sm text-app-danger">
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
      subtitle="Welcome back. Your private workspace awaits."
      footer={
        <p>
          New to VaultSpace?{" "}
          <Link href="/register" className={authLinkClass}>
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => void onPasswordSubmit(e)} className="space-y-5" aria-label="Sign in" aria-busy={busy}>
        <AuthField label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@example.com"
          />
        </AuthField>
        <AuthSecretField
          label="Password"
          required
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
        {error ? (
          <p role="alert" className="text-sm text-app-danger">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className={authPrimaryBtnClass}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <AuthNotice>You’ll unlock your vault after signing in.</AuthNotice>
      </form>
    </AuthShell>
  );
}
