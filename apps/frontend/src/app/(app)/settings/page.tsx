"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fullNameFromUser } from "@/lib/files/format";
import {
  AUTOLOCK_OPTIONS,
  type AutolockOption,
  getAutolock,
  setAutolock,
} from "@/lib/settings";
import { changeAccountPassword } from "@/lib/auth/password";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  beginTwofaSetup,
  disableTwofa,
  enableTwofa,
  fetchTwofaStatus,
  type TwofaSetup,
} from "@/lib/twofa";
import { SecretInput } from "@/components/ui/secret-input";
import { useVault } from "@/lib/vault/VaultProvider";

type SessionRow = {
  id: string;
  device: string;
  meta: string;
  current: boolean;
};

export default function SettingsPage() {
  const { user, token, logout, updateName } = useAuth();
  const { unlocked, lock } = useVault();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [autolock, setAutolockState] = useState<AutolockOption>("15 min");
  const [twofa, setTwofaState] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [setup, setSetup] = useState<TwofaSetup | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [twofaBusy, setTwofaBusy] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCode, setPasswordCode] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    setAutolockState(getAutolock());
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent : "Browser";
    const device = /Chrome/.test(ua)
      ? "Chrome on this device"
      : /Safari/.test(ua)
        ? "Safari on this device"
        : "This browser";
    setSessions([
      {
        id: "current",
        device,
        meta: "Active now",
        current: true,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!token) return;
    void fetchTwofaStatus(token)
      .then((s) => setTwofaState(s.enabled))
      .catch(() => setTwofaState(false));
  }, [token]);

  useEffect(() => {
    setNameDraft(user?.name?.trim() ?? "");
  }, [user?.id, user?.name]);

  function say(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordCode("");
    setPasswordError(null);
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don’t match");
      return;
    }
    if (twofa && !passwordCode.trim()) {
      setPasswordError("Enter your authenticator code to continue");
      return;
    }

    setPasswordBusy(true);
    try {
      await changeAccountPassword(token, {
        currentPassword,
        newPassword,
        ...(twofa ? { code: passwordCode.trim() } : {}),
      });
      resetPasswordForm();
      setShowPassword(false);
      say("Account password updated");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Couldn’t change password",
      );
    } finally {
      setPasswordBusy(false);
    }
  }

  async function saveName() {
    const next = nameDraft.trim();
    if (!next) {
      say("Name can’t be empty");
      return;
    }
    if (next === (user?.name?.trim() ?? "")) {
      say("Name is already up to date");
      return;
    }
    setSavingName(true);
    try {
      await updateName(next);
      say("Name updated");
    } catch (err) {
      say(err instanceof Error ? err.message : "Couldn’t update name");
    } finally {
      setSavingName(false);
    }
  }

  async function onToggleTwofa() {
    if (!token) return;
    setTwofaBusy(true);
    try {
      if (twofa) {
        setShowDisable(true);
        setSetup(null);
        setRecoveryCodes(null);
      } else {
        const next = await beginTwofaSetup(token);
        setSetup(next);
        setShowDisable(false);
        setRecoveryCodes(null);
        setSetupCode("");
      }
    } catch (err) {
      say(err instanceof Error ? err.message : "Couldn’t start 2FA setup");
    } finally {
      setTwofaBusy(false);
    }
  }

  async function onConfirmEnable(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setTwofaBusy(true);
    try {
      const res = await enableTwofa(token, setupCode.trim());
      setTwofaState(true);
      setSetup(null);
      setSetupCode("");
      setRecoveryCodes(res.recoveryCodes);
      say("Two-factor authentication enabled");
    } catch (err) {
      say(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setTwofaBusy(false);
    }
  }

  async function onConfirmDisable(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setTwofaBusy(true);
    try {
      await disableTwofa(token, disableCode.trim());
      setTwofaState(false);
      setShowDisable(false);
      setDisableCode("");
      setRecoveryCodes(null);
      say("Two-factor authentication disabled");
    } catch (err) {
      say(err instanceof Error ? err.message : "Couldn’t disable 2FA");
    } finally {
      setTwofaBusy(false);
    }
  }

  function signOut() {
    lock();
    logout();
    router.push("/login");
  }

  const nameDirty = nameDraft.trim() !== (user?.name?.trim() ?? "");

  return (
      <div className="flex w-full max-w-[760px] flex-col gap-7 px-7 py-7 pb-[60px]">
        <h1 className="text-2xl font-semibold tracking-tight text-app-text">
          Settings
        </h1>
        {toast ? (
          <p className="rounded-[10px] bg-app-accent-soft px-3 py-2 text-sm">
            {toast}
          </p>
        ) : null}

        <section className="rounded-[12px] border border-app-border bg-app-surface p-5">
          <h2 className="text-sm font-semibold text-app-text">Account</h2>
          <div className="mt-4 space-y-4 text-sm">
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                void saveName();
              }}
            >
              <label
                htmlFor="account-name"
                className="block text-app-muted"
              >
                Name
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="account-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={nameDraft}
                  maxLength={120}
                  placeholder={fullNameFromUser(user, "Your name")}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="min-w-0 flex-1 rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm font-medium text-app-text outline-none focus:border-app-focus focus:ring-2 focus:ring-app-focus/20"
                />
                <button
                  type="submit"
                  disabled={savingName || !nameDirty || !nameDraft.trim()}
                  className="shrink-0 rounded-[10px] bg-app-primary px-4 py-2 text-xs font-semibold text-app-primary-fg hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
            <div className="flex justify-between gap-4 border-t border-app-border pt-4">
              <span className="text-app-muted">Email</span>
              <span className="font-medium text-app-text">{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="rounded-[12px] border border-app-border bg-app-surface p-5">
          <h2 className="text-sm font-semibold text-app-text">Security</h2>

          <div className="mt-4 border-b border-app-border pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-app-text">
                  Two-factor authentication
                </p>
                <p className="mt-0.5 text-[13px] text-app-muted">
                  {twofa
                    ? "Authenticator app required at sign-in."
                    : "Add Google Authenticator (or Authy / 1Password) for sign-in."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={twofa}
                disabled={twofaBusy}
                onClick={() => void onToggleTwofa()}
                className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
                  twofa ? "bg-emerald-500" : "bg-app-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-app-surface shadow transition ${
                    twofa ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {setup ? (
              <form
                onSubmit={(e) => void onConfirmEnable(e)}
                className="mt-4 space-y-3 rounded-[12px] border border-app-border bg-app-bg p-4"
              >
                <p className="text-[13px] text-app-muted">
                  Scan this QR with your authenticator app, then enter the
                  6-digit code.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={setup.qrDataUrl}
                  alt="2FA QR code"
                  className="mx-auto h-[180px] w-[180px] rounded-lg bg-app-surface p-2"
                />
                <p className="break-all text-center font-mono text-[11px] text-app-muted">
                  {setup.secret}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  pattern="\d{6}"
                  value={setupCode}
                  onChange={(e) => setSetupCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={twofaBusy}
                    onClick={() => {
                      setSetup(null);
                      setSetupCode("");
                    }}
                    className="rounded-[10px] border border-app-border px-3 py-2 text-xs font-semibold hover:bg-app-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={twofaBusy}
                    className="rounded-[10px] bg-app-primary px-4 py-2 text-xs font-semibold text-app-primary-fg disabled:opacity-60"
                  >
                    {twofaBusy ? "Enabling…" : "Confirm and enable"}
                  </button>
                </div>
              </form>
            ) : null}

            {showDisable ? (
              <form
                onSubmit={(e) => void onConfirmDisable(e)}
                className="mt-4 space-y-3 rounded-[12px] border border-app-border bg-app-bg p-4"
              >
                <p className="text-[13px] text-app-muted">
                  Enter a current authenticator code or a recovery code to
                  disable 2FA.
                </p>
                <input
                  type="text"
                  required
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                  placeholder="123456 or XXXX-XXXX"
                  className="w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={twofaBusy}
                    onClick={() => {
                      setShowDisable(false);
                      setDisableCode("");
                    }}
                    className="rounded-[10px] border border-app-border px-3 py-2 text-xs font-semibold hover:bg-app-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={twofaBusy}
                    className="rounded-[10px] border border-red-200 px-4 py-2 text-xs font-semibold text-app-danger hover:bg-app-danger-soft disabled:opacity-60"
                  >
                    {twofaBusy ? "Disabling…" : "Disable 2FA"}
                  </button>
                </div>
              </form>
            ) : null}

            {recoveryCodes ? (
              <div className="mt-4 space-y-3 rounded-[12px] border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-950">
                  Save these recovery codes
                </p>
                <p className="text-[13px] text-amber-900/80">
                  Each code works once if you lose your authenticator. Store
                  them offline — they won’t be shown again.
                </p>
                <ul className="grid grid-cols-2 gap-2 font-mono text-[13px] text-amber-950">
                  {recoveryCodes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(recoveryCodes.join("\n"));
                    say("Recovery codes copied");
                  }}
                  className="rounded-[10px] border border-amber-300 bg-app-surface px-3 py-1.5 text-xs font-semibold text-amber-950"
                >
                  Copy codes
                </button>
                <button
                  type="button"
                  onClick={() => setRecoveryCodes(null)}
                  className="ml-2 text-xs font-semibold text-amber-900/70 hover:text-amber-950"
                >
                  Done
                </button>
              </div>
            ) : null}
          </div>

          <div className="border-b border-app-border py-4">
            <p className="text-sm font-medium text-app-text">Appearance</p>
            <p className="mt-0.5 text-[13px] text-app-muted">
              Switch between light and dark UI for the app and landing pages.
            </p>
            <div className="mt-3 flex flex-wrap gap-1 rounded-[10px] border border-app-border p-1">
              {(
                [
                  { id: "light", label: "Light" },
                  { id: "dark", label: "Dark" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    say(`${opt.label} mode on`);
                  }}
                  className={`rounded-[8px] px-3 py-1.5 text-xs font-medium transition ${
                    theme === opt.id
                      ? "bg-app-accent-soft text-app-text"
                      : "text-app-muted hover:bg-app-bg"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-app-border py-4">
            <p className="text-sm font-medium text-app-text">Auto-lock vault</p>
            <p className="mt-0.5 text-[13px] text-app-muted">
              Clears the decrypted private key from memory after inactivity.
            </p>
            <div className="mt-3 flex flex-wrap gap-1 rounded-[10px] border border-app-border p-1">
              {AUTOLOCK_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setAutolockState(opt);
                    setAutolock(opt);
                    say(`Auto-lock set to ${opt}`);
                  }}
                  className={`rounded-[8px] px-3 py-1.5 text-xs font-medium transition ${
                    autolock === opt
                      ? "bg-app-accent-soft text-app-text"
                      : "text-app-muted hover:bg-app-bg"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-app-text">
                  Account password
                </p>
                <p className="mt-0.5 text-[13px] text-app-muted">
                  Separate from your key passphrase.
                  {twofa
                    ? " Authenticator code required when 2FA is on."
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPassword((v) => !v);
                  setPasswordError(null);
                  if (showPassword) resetPasswordForm();
                }}
                className="rounded-[10px] border border-app-border px-3 py-1.5 text-xs font-semibold hover:bg-app-bg"
              >
                {showPassword ? "Cancel" : "Change"}
              </button>
            </div>

            {showPassword ? (
              <form
                onSubmit={(e) => void onChangePassword(e)}
                className="mt-4 space-y-3 rounded-[10px] border border-app-border bg-app-bg/40 p-4"
              >
                <label className="block">
                  <span className="text-[12px] font-medium text-app-muted">
                    Current password
                  </span>
                  <SecretInput
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-app-muted">
                    New password
                  </span>
                  <SecretInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-app-muted">
                    Confirm new password
                  </span>
                  <SecretInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                  />
                </label>
                {twofa ? (
                  <label className="block">
                    <span className="text-[12px] font-medium text-app-muted">
                      Authenticator code
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      placeholder="123456"
                      value={passwordCode}
                      onChange={(e) => setPasswordCode(e.target.value)}
                      className="mt-1 w-full rounded-[10px] border border-app-input-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
                    />
                    <span className="mt-1 block text-[12px] text-app-muted-2">
                      Or use a recovery code if you can’t open your app.
                    </span>
                  </label>
                ) : null}
                {passwordError ? (
                  <p className="text-sm text-app-danger">{passwordError}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={passwordBusy}
                  className="rounded-[10px] bg-app-primary px-4 py-2 text-sm font-semibold text-app-primary-fg hover:bg-app-primary-hover disabled:opacity-60"
                >
                  {passwordBusy ? "Updating…" : "Update password"}
                </button>
              </form>
            ) : null}
          </div>
        </section>

        <section className="rounded-[12px] border border-app-border bg-app-surface p-5">
          <h2 className="text-sm font-semibold text-app-text">
            Active sessions
          </h2>
          <ul className="mt-4 divide-y divide-app-border">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-app-text">
                    {s.device}
                  </p>
                  <p className="text-[13px] text-app-muted">{s.meta}</p>
                </div>
                {s.current ? (
                  <span className="text-xs font-semibold text-emerald-600">
                    This device
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSessions((list) =>
                        list.filter((x) => x.id !== s.id),
                      );
                      say("Session signed out");
                    }}
                    className="text-xs font-semibold text-app-muted hover:text-app-text"
                  >
                    Sign out
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-app-muted-2">
            Vault session: {unlocked ? "unlocked in this tab" : "locked"}
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={signOut}
            className="rounded-[10px] border border-app-border px-4 py-2 text-sm font-medium hover:bg-app-bg"
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={() =>
              say("Account deletion requires confirming your passphrase")
            }
            className="rounded-[10px] border border-red-200 px-4 py-2 text-sm font-medium text-app-danger hover:bg-app-danger-soft"
          >
            Delete account
          </button>
        </div>
      </div>
  );
}
