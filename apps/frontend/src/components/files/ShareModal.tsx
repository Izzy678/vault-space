"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="z-[70] gap-0 overflow-visible p-0 sm:max-w-[440px]"
        overlayClassName="z-[70] bg-black/40 supports-backdrop-filter:backdrop-blur-[2px]"
      >
        <DialogHeader className="gap-1 border-b border-border px-5 py-4 text-left">
          <DialogTitle className="text-[17px] font-semibold tracking-tight">
            Share file
          </DialogTitle>
          <DialogDescription className="truncate text-[13px]">
            {file.originalName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <p className="text-[13px] leading-5 text-muted-foreground">
            Re-wraps the file key to their public key in your browser. Recipients
            must already be in Keys.
          </p>

          <form onSubmit={(e) => void onShare(e)} className="space-y-3">
            <div ref={pickerRef} className="relative">
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                Add people
              </label>
              <Button
                type="button"
                variant="outline"
                aria-expanded={pickerOpen}
                aria-haspopup="listbox"
                disabled={contacts.length === 0}
                onClick={() => {
                  setPickerOpen((v) => !v);
                  window.setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="h-auto w-full justify-start gap-3 px-3 py-2.5"
              >
                {selected ? (
                  <>
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{
                        background: `oklch(0.9 0.05 ${selected.hue})`,
                      }}
                    >
                      {contactInitials(selected.name)}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {selected.name}
                      </span>
                      <span className="block truncate text-[12px] font-normal text-muted-foreground">
                        {selected.email}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] text-muted-foreground">
                      +
                    </span>
                    <span className="flex-1 text-left text-sm font-normal text-muted-foreground">
                      Choose a contact…
                    </span>
                  </>
                )}
                <ChevronDown
                  className={`ml-auto size-4 shrink-0 text-muted-foreground transition ${pickerOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {pickerOpen ? (
                <div
                  role="listbox"
                  className="absolute top-[calc(100%+6px)] right-0 left-0 z-10 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
                >
                  <div className="border-b border-border p-2">
                    <Input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search contacts…"
                      className="h-9 bg-muted/60"
                    />
                  </div>
                  <ul className="max-h-52 overflow-auto py-1">
                    {filtered.length === 0 ? (
                      <li className="px-3 py-6 text-center text-[13px] text-muted-foreground">
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
                                    ? "bg-muted"
                                    : "hover:bg-muted/70"
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
                                  <span className="truncate text-sm font-medium">
                                    {c.name}
                                  </span>
                                  {c.verified ? (
                                    <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                      Verified
                                    </span>
                                  ) : null}
                                </span>
                                <span className="block truncate text-[12px] text-muted-foreground">
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

            <Button
              type="submit"
              disabled={busy || !selected || !unlocked}
              className="h-10 w-full"
              size="lg"
            >
              {busy
                ? "Sharing…"
                : selected
                  ? `Share with ${selected.name}`
                  : "Share"}
            </Button>
          </form>

          {contacts.length === 0 ? (
            <p className="rounded-xl bg-muted px-3 py-3 text-[13px] text-muted-foreground">
              No shareable contacts yet. Add a VaultSpace user on the Keys page
              first.
            </p>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {toast ? (
            <p className="text-sm text-emerald-700">{toast}</p>
          ) : null}

          <div>
            <p className="text-[12px] font-medium text-muted-foreground">
              People with access
            </p>
            {access.length === 0 ? (
              <p className="mt-2 text-[13px] text-muted-foreground">
                Only you can open this file right now.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {access.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/70"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold">
                      {contactInitials(row.recipientName || row.recipientEmail)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {row.recipientName || row.recipientEmail}
                      </p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {row.recipientEmail} · Can download
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => void onRevoke(row.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
