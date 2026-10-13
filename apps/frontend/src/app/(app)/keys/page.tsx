"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { apiJson } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  addContact,
  contactInitials,
  deleteContact,
  fetchContacts,
  verifyContact,
  type ContactRow,
} from "@/lib/contacts";
import type { VaultPackagePayload } from "@/lib/crypto";
import { formatFingerprint } from "@/lib/settings";
import { useVault } from "@/lib/vault/VaultProvider";

type VaultMeta = VaultPackagePayload & { createdAt?: string; status?: string };

export default function KeysPage() {
  const { token } = useAuth();
  const { unlocked } = useVault();
  const [vault, setVault] = useState<VaultMeta | null>(null);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  const say = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const reload = useCallback(async () => {
    if (!token) return;
    const [v, c, files] = await Promise.all([
      apiJson<VaultMeta>("/vault", { token }),
      fetchContacts(token),
      apiJson<{ id: string }[]>("/files", { token }),
    ]);
    setVault(v);
    setContacts(c);
    setFileCount(files.length);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void reload().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load keys"),
    );
  }, [token, reload]);

  async function onCopyPublic() {
    if (!vault?.publicKeyPem) return;
    try {
      await navigator.clipboard.writeText(vault.publicKeyPem);
      say("Public key copied");
    } catch {
      say("Could not copy — select the key manually");
    }
  }

  async function onAddContact(e: FormEvent) {
    e.preventDefault();
    if (!token || !email.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await addContact(token, {
        email: email.trim(),
        name: name.trim() || undefined,
      });
      setEmail("");
      setName("");
      await reload();
      say("Contact added");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add contact");
    } finally {
      setAdding(false);
    }
  }

  async function onVerify(c: ContactRow) {
    if (!token) return;
    await verifyContact(token, c.id, !c.verified);
    await reload();
    if (!c.verified) say(`${c.name}'s public key verified`);
  }

  async function onRemove(c: ContactRow) {
    if (!token) return;
    await deleteContact(token, c.id);
    await reload();
    say("Contact removed");
  }

  if (!unlocked) {
    return (
      <div className="px-7 py-10 text-sm text-app-muted">Unlocking vault…</div>
    );
  }

  const created = vault?.createdAt
    ? new Date(vault.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
      <div className="flex w-full max-w-[860px] flex-col gap-6 px-7 py-7 pb-[60px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium tracking-tight text-app-text">
            Keys
          </h1>
          <p className="text-sm text-app-muted">
            Your keypair protects every file key in your vault.
          </p>
        </div>

        {toast ? (
          <p className="rounded-[10px] bg-app-accent-soft px-3 py-2 text-sm text-app-text">
            {toast}
          </p>
        ) : null}
        {error ? <p className="text-sm text-app-danger">{error}</p> : null}

        <section className="flex flex-col rounded-[12px] border border-app-border bg-app-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border px-5 py-4">
            <div className="flex items-center gap-2.5 font-medium text-app-text">
              Your keypair
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Active
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onCopyPublic()}
                className="rounded-[8px] border border-app-border px-3 py-1.5 text-xs font-medium hover:bg-app-bg"
              >
                Copy public key
              </button>
              <button
                type="button"
                onClick={() =>
                  say(
                    "Change passphrase will re-wrap your private key in a future update",
                  )
                }
                className="rounded-[8px] border border-app-border px-3 py-1.5 text-xs font-medium hover:bg-app-bg"
              >
                Change passphrase
              </button>
              <button
                type="button"
                onClick={() =>
                  say(
                    "Rotate keypair needs re-wrapping every file key — coming with sharing",
                  )
                }
                className="rounded-[8px] border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-50"
              >
                Rotate keypair
              </button>
            </div>
          </div>

          <dl className="divide-y divide-app-border text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
              <dt className="text-app-muted">Algorithm</dt>
              <dd className="text-app-text">RSA-2048 · OAEP with SHA-256</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
              <dt className="text-app-muted">Created</dt>
              <dd className="text-app-text">{created}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
              <dt className="text-app-muted">Fingerprint</dt>
              <dd className="break-all font-mono text-[12px] text-app-text">
                {formatFingerprint(
                  unlocked.fingerprint || vault?.fingerprint || "",
                )}
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
              <dt className="shrink-0 text-app-muted">Private key</dt>
              <dd className="max-w-[28rem] text-right text-[13px] text-app-muted">
                Encrypted with your passphrase (AES-256-GCM, PBKDF2-SHA256 ·{" "}
                {vault?.kdfIterations?.toLocaleString() ?? "310,000"} iterations)
                and stored on the server
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
              <dt className="text-app-muted">Protects</dt>
              <dd className="text-app-text">
                {fileCount} file {fileCount === 1 ? "key" : "keys"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium text-app-text">
              Contacts&apos; public keys
            </h2>
            <p className="text-sm text-app-muted">
              Compare fingerprints with the person over another channel before
              marking a key verified. Add a VaultSpace user by email to import
              their public key.
            </p>
          </div>

          <form
            onSubmit={(e) => void onAddContact(e)}
            className="flex flex-wrap gap-2"
          >
            <input
              type="text"
              placeholder="Display name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-[140px] flex-1 rounded-[10px] border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
            />
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-[180px] flex-[1.2] rounded-[10px] border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-app-focus"
            />
            <button
              type="submit"
              disabled={adding}
              className="rounded-[10px] bg-app-primary px-4 py-2 text-sm font-semibold text-white hover:bg-app-primary-hover disabled:opacity-60"
            >
              {adding ? "Adding…" : "Add contact"}
            </button>
          </form>

          <div className="overflow-hidden rounded-[12px] border border-app-border bg-app-surface">
            {contacts.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-app-muted">
                No contacts yet. Add someone who already has a VaultSpace vault.
              </p>
            ) : (
              <ul className="divide-y divide-app-border">
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3"
                  >
                    <span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-app-text"
                      style={{
                        background: `oklch(0.88 0.06 ${c.hue})`,
                      }}
                    >
                      {contactInitials(c.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-app-text">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-app-muted">
                        {c.email}
                      </p>
                    </div>
                    <code className="hidden max-w-[220px] truncate font-mono text-[11px] text-app-muted md:block">
                      {formatFingerprint(c.fingerprint)}
                    </code>
                    <button
                      type="button"
                      onClick={() => void onVerify(c)}
                      className={`rounded-[10px] border px-3 py-1.5 text-xs font-semibold ${
                        c.verified
                          ? "border-emerald-200 text-emerald-700"
                          : "border-app-border text-app-muted hover:bg-app-bg"
                      }`}
                    >
                      {c.verified ? "Verified" : "Mark verified"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onRemove(c)}
                      className="text-xs text-app-muted hover:text-app-danger"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
  );
}
