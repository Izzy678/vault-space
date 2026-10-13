"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  contactInitials,
  fetchContacts,
  type ContactRow,
} from "@/lib/contacts";
import type { FileRow } from "@/lib/files/types";
import {
  fetchFileShares,
  revokeShare,
  shareFileWithContact,
  type FileAccessRow,
} from "@/lib/shares";
import { useVault } from "@/lib/vault/VaultProvider";

export function ShareModal({
  file,
  onClose,
  onShared,
}: {
  file: FileRow;
  onClose: () => void;
  onShared?: () => void;
}) {
  const { token } = useAuth();
  const { unlocked } = useVault();
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [access, setAccess] = useState<FileAccessRow[]>([]);
  const [contactId, setContactId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function reload() {
    if (!token) return;
    const [c, a] = await Promise.all([
      fetchContacts(token),
      fetchFileShares(token, file.id),
    ]);
    setContacts(c.filter((x) => !!x.contactUserId));
    setAccess(a);
  }

  useEffect(() => {
    void reload().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, file.id]);

  async function onShare(e: FormEvent) {
    e.preventDefault();
    if (!token || !unlocked || !contactId) return;
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;
    setBusy(true);
    setError(null);
    try {
      await shareFileWithContact(token, unlocked, file.id, contact);
      setContactId("");
      setToast(`Shared with ${contact.name}`);
      await reload();
      onShared?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Share failed");
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(shareId: string) {
    if (!token) return;
    setBusy(true);
    try {
      await revokeShare(token, shareId);
      await reload();
      setToast("Access revoked");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(20,24,30,0.35)] p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share file"
        className="w-full max-w-[480px] rounded-[14px] border border-[#dcdfe3] bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-app-border px-5 py-4">
          <h3 className="text-base font-semibold text-app-text">Share file</h3>
          <p className="mt-1 truncate text-[13px] text-app-muted">
            {file.originalName}
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <p className="text-[13px] text-app-muted">
            The file key is re-wrapped to their public key in your browser. They
            must already be in your Keys contacts.
          </p>

          <form onSubmit={(e) => void onShare(e)} className="flex gap-2">
            <select
              required
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="min-w-0 flex-1 rounded-[10px] border border-app-input-border bg-white px-3 py-2 text-sm outline-none focus:border-app-focus"
            >
              <option value="">Select a contact…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                  {c.verified ? "" : " · unverified"}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy || !contactId || !unlocked}
              className="shrink-0 rounded-[10px] bg-app-primary px-4 py-2 text-sm font-semibold text-white hover:bg-app-primary-hover disabled:opacity-60"
            >
              {busy ? "Sharing…" : "Share"}
            </button>
          </form>

          {contacts.length === 0 ? (
            <p className="text-[13px] text-app-muted">
              No shareable contacts yet. Add a VaultSpace user on the Keys page
              first.
            </p>
          ) : null}

          {error ? <p className="text-sm text-app-danger">{error}</p> : null}
          {toast ? (
            <p className="text-sm text-emerald-700">{toast}</p>
          ) : null}

          <div>
            <p className="text-[12px] font-medium text-app-muted">
              People with access
            </p>
            {access.length === 0 ? (
              <p className="mt-2 text-[13px] text-app-muted-2">
                Only you can open this file right now.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-app-border rounded-[10px] border border-app-border">
                {access.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-[11px] font-bold">
                      {contactInitials(row.recipientName || row.recipientEmail)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {row.recipientName || row.recipientEmail}
                      </p>
                      <p className="truncate text-[12px] text-app-muted">
                        {row.recipientEmail} · Can download
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onRevoke(row.id)}
                      className="text-xs font-semibold text-app-muted hover:text-app-danger"
                    >
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-app-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border border-app-border px-4 py-2 text-sm font-medium hover:bg-app-bg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
