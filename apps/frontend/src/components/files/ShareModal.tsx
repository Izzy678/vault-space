"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  const [selected, setSelected] = useState<ContactRow | null>(null);
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (pickerOpen) setPickerOpen(false);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, pickerOpen]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);

  const sharedEmails = useMemo(
    () => new Set(access.map((a) => a.recipientEmail.toLowerCase())),
    [access],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    });
  }, [contacts, query]);

  async function onShare(e: FormEvent) {
    e.preventDefault();
    if (!token || !unlocked || !selected) return;
    setBusy(true);
    setError(null);
    try {
      await shareFileWithContact(token, unlocked, file.id, selected);
      setToast(`Shared with ${selected.name}`);
      setSelected(null);
      setQuery("");
      setPickerOpen(false);
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

  function pickContact(c: ContactRow) {
    if (sharedEmails.has(c.email.toLowerCase())) return;
    setSelected(c);
    setQuery("");
    setPickerOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(20,24,30,0.4)] p-5 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share file"
        className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#e6e8eb] bg-white shadow-[0_24px_64px_rgba(16,24,40,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold tracking-tight text-app-text">
              Share file
            </h3>
            <p className="mt-1 truncate text-[13px] text-app-muted">
              {file.originalName}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg text-app-muted hover:bg-[#f0f2f4]"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-5 pb-5">
          <p className="text-[13px] leading-5 text-app-muted">
            Re-wraps the file key to their public key in your browser. Recipients
            must already be in Keys.
          </p>

          <form onSubmit={(e) => void onShare(e)} className="space-y-3">
            <div ref={pickerRef} className="relative">
              <label className="mb-1.5 block text-[12px] font-medium text-app-muted">
                Add people
              </label>
              <button
                type="button"
                aria-expanded={pickerOpen}
                aria-haspopup="listbox"
                disabled={contacts.length === 0}
                onClick={() => {
                  setPickerOpen((v) => !v);
                  window.setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-[#d8dce2] bg-[#fafbfc] px-3 py-2.5 text-left transition hover:border-[#c5cad3] hover:bg-white focus:border-app-focus focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {selected ? (
                  <>
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-app-text"
                      style={{
                        background: `oklch(0.9 0.05 ${selected.hue})`,
                      }}
                    >
                      {contactInitials(selected.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-app-text">
                        {selected.name}
                      </span>
                      <span className="block truncate text-[12px] text-app-muted">
                        {selected.email}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eceef0] text-[13px] text-app-muted">
                      +
                    </span>
                    <span className="flex-1 text-sm text-app-muted">
                      Choose a contact…
                    </span>
                  </>
                )}
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className={`shrink-0 text-app-muted transition ${pickerOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {pickerOpen ? (
                <div
                  role="listbox"
                  className="absolute top-[calc(100%+6px)] right-0 left-0 z-10 overflow-hidden rounded-xl border border-[#e3e5e8] bg-white shadow-[0_12px_32px_rgba(16,24,40,0.12)]"
                >
                  <div className="border-b border-[#eef0f2] p-2">
                    <input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search contacts…"
                      className="w-full rounded-lg border border-transparent bg-[#f4f5f6] px-3 py-2 text-sm outline-none placeholder:text-app-muted-2 focus:border-app-focus focus:bg-white"
                    />
                  </div>
                  <ul className="max-h-52 overflow-auto py-1">
                    {filtered.length === 0 ? (
                      <li className="px-3 py-6 text-center text-[13px] text-app-muted">
                        No contacts match
                      </li>
                    ) : (
                      filtered.map((c) => {
                        const already = sharedEmails.has(c.email.toLowerCase());
                        const active = selected?.id === c.id;
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={active}
                              disabled={already}
                              onClick={() => pickContact(c)}
                              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                                already
                                  ? "cursor-not-allowed opacity-45"
                                  : active
                                    ? "bg-[#f0f2f4]"
                                    : "hover:bg-[#f6f7f8]"
                              }`}
                            >
                              <span
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                                style={{
                                  background: `oklch(0.9 0.05 ${c.hue})`,
                                }}
                              >
                                {contactInitials(c.name)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2">
                                  <span className="truncate text-sm font-medium text-app-text">
                                    {c.name}
                                  </span>
                                  {c.verified ? (
                                    <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                      Verified
                                    </span>
                                  ) : null}
                                </span>
                                <span className="block truncate text-[12px] text-app-muted">
                                  {already ? "Already has access" : c.email}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={busy || !selected || !unlocked}
              className="h-10 w-full rounded-xl bg-app-primary text-sm font-semibold text-white transition hover:bg-app-primary-hover disabled:opacity-50"
            >
              {busy ? "Sharing…" : selected ? `Share with ${selected.name}` : "Share"}
            </button>
          </form>

          {contacts.length === 0 ? (
            <p className="rounded-xl bg-[#f6f7f8] px-3 py-3 text-[13px] text-app-muted">
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
              <ul className="mt-2 space-y-1">
                {access.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#f6f7f8]"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-[11px] font-bold">
                      {contactInitials(row.recipientName || row.recipientEmail)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-app-text">
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
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-app-muted hover:bg-white hover:text-app-danger"
                    >
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
