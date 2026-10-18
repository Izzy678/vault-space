"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthSecretField,
  AuthShell,
  AuthNotice,
  authInputClass,
  authPrimaryBtnClass,
  authLinkClass,
  authPasswordRulesClass,
} from "@/components/auth/AuthShell";
import { PasswordStrengthPanel } from "@/components/auth/PasswordStrength";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  evaluatePasswordStrength,
  STRONG_PASSWORD_HINT,
} from "@/lib/auth/passwordStrength";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const strength = useMemo(
    () => evaluatePasswordStrength(password),
    [password],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!strength.allMet) {
      setError(
        strength.unmetLabels.length
          ? `Password needs: ${strength.unmetLabels.join(", ").toLowerCase()}.`
          : STRONG_PASSWORD_HINT,
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await register(name.trim(), email, password);
      router.push("/security");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      stage="register"
      title="Create an account"
      subtitle="A private space for your files."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5" aria-label="Create an account" aria-busy={busy}>
        <AuthField label="Name">
          <input
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={authInputClass}
            placeholder="Your name"
          />
        </AuthField>
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
        <div className="space-y-2">
          <AuthSecretField
            label="Password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Create a strong password"
            aria-describedby="password-requirements"
          />
          <div id="password-requirements" className={authPasswordRulesClass}>
            <PasswordStrengthPanel password={password} />
          </div>
        </div>
        {error ? (
          <p role="alert" className="text-sm text-app-danger">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !strength.allMet}
          className={authPrimaryBtnClass}
        >
          {busy ? "Creating…" : "Create account"}
        </button>
        <AuthNotice>Next, you’ll set a separate passphrase for your vault.</AuthNotice>
      </form>
    </AuthShell>
  );
}
