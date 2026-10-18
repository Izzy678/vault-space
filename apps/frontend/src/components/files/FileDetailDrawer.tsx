"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { apiJson } from "@/lib/api/client";
import { contactInitials } from "@/lib/contacts";
import { getExtension } from "@/lib/files/categories";
import { formatBytes, formatModified, fullNameFromUser } from "@/lib/files/format";
import type { FileRow } from "@/lib/files/types";
import {
  fetchFileShares,
  revokeShare,
  type FileAccessRow,
} from "@/lib/shares";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShareModal } from "./ShareModal";

type FileMeta = FileRow & {
  wrappedAesKey?: string;
  iv?: string;
  authTag?: string;
  ciphertextHash?: string;
  encryptionAlgo?: string;
  wrappingAlgo?: string;
};

function shortMono(value: string | undefined, keep = 18) {
  if (!value) return "—";
  if (value.length <= keep) return value;
  return `${value.slice(0, keep)}…`;
}

export function FileDetailDrawer({
  file,
  mode = "owned",
  onClose,
  onDownload,
  onDelete,
  onChanged,
}: {
  file: FileRow;
  mode?: "owned" | "shared";
  onClose: () => void;
  onDownload: (file: FileRow) => void;
  onDelete?: (id: string) => void;
  onChanged?: () => void;
}) {
  const { token, user } = useAuth();
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [access, setAccess] = useState<FileAccessRow[]>([]);
  const [techOpen, setTechOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ext = getExtension(file.originalName).toUpperCase() || "FILE";
  const owned = mode === "owned";

  async function reload() {
    if (!token) return;
    setError(null);
    try {
      if (owned) {
        const [m, a] = await Promise.all([
          apiJson<FileMeta>(`/files/${file.id}`, { token }),
          fetchFileShares(token, file.id),
        ]);
        setMeta(m);
        setAccess(a);
      } else {
        const m = await apiJson<FileMeta>(`/shares/${file.id}`, { token });
        setMeta({
          ...file,
          ...m,
          id: file.id,
        });
        setAccess([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load details");
    }
  }

  useEffect(() => {
    void reload();
    setTechOpen(false);
    setShareOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.id, mode, token]);

  async function onRevoke(shareId: string) {
    if (!token) return;
    setBusy(true);
    try {
      await revokeShare(token, shareId);
      await reload();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open && !shareOpen) onClose();
        }}
      >
        <SheetContent
          side="right"
          showCloseButton
          className="w-full gap-0 overflow-auto p-0 sm:max-w-[400px]"
        >
          <SheetHeader className="flex-row items-start gap-3.5 space-y-0 p-5 pr-12 text-left">
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[9px] bg-muted font-mono text-[11px] font-medium">
              {ext.slice(0, 4)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="break-words text-[15px] leading-snug font-medium">
                {file.originalName}
              </SheetTitle>
              <SheetDescription className="mt-1 text-[12px]">
                {formatBytes(file.sizeBytes)} · {formatModified(file.uploadedAt)}
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="mx-5 flex items-center gap-2 rounded-lg bg-app-success-soft px-3 py-2.5 text-[13px] text-app-success">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-app-success" />
            Encrypted end-to-end · AES-256-GCM
          </div>

          <div className="flex gap-2 px-5 py-4">
            <Button
              type="button"
              onClick={() => onDownload(file)}
              className="h-[38px] flex-1"
            >
              Download
            </Button>
            {owned ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShareOpen(true)}
                className="h-[38px] flex-1"
              >
                Share
              </Button>
            ) : null}
          </div>

          {error ? (
            <p className="px-5 pb-2 text-sm text-destructive">{error}</p>
          ) : null}

          {owned ? (
            <div className="border-t border-border px-5 py-4">
              <p className="text-[12px] text-muted-foreground">
                People with access
              </p>
              <ul className="mt-3 space-y-3">
                <li className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold">
                    {contactInitials(fullNameFromUser(user))}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px]">{fullNameFromUser(user)}</p>
                    <p className="text-[11px] text-muted-foreground">Owner</p>
                  </div>
                </li>
                {access.map((row) => (
                  <li key={row.id} className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                      {contactInitials(row.recipientName || row.recipientEmail)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">
                        {row.recipientName || row.recipientEmail}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Can download
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={busy}
                      onClick={() => void onRevoke(row.id)}
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border-t border-border px-5 py-4">
              <p className="text-[12px] text-muted-foreground">Shared with you</p>
              <p className="mt-2 text-[13px]">
                You can download and decrypt this file with your vault key.
              </p>
            </div>
          )}

          <div className="border-t border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Encryption</span>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setTechOpen((v) => !v)}
                className="h-auto px-0 text-[12px] text-app-success"
              >
                {techOpen ? "Hide details" : "Show details"}
              </Button>
            </div>
            <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[12px]">
              <dt className="text-muted-foreground">Cipher</dt>
              <dd>{meta?.encryptionAlgo ?? "AES-256-GCM"}</dd>
              <dt className="text-muted-foreground">Wrapping</dt>
              <dd>{meta?.wrappingAlgo ?? "RSA-OAEP-SHA256"}</dd>
              <dt className="text-muted-foreground">Wrapped for</dt>
              <dd>{owned ? "Your vault key" : "Your shared key"}</dd>
            </dl>

            {techOpen ? (
              <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-lg border border-border bg-muted/60 p-3 font-mono text-[11px]">
                <dt className="font-sans text-muted-foreground">IV (96-bit)</dt>
                <dd className="break-all">{shortMono(meta?.iv, 24)}</dd>
                <dt className="font-sans text-muted-foreground">Auth tag</dt>
                <dd className="break-all">{shortMono(meta?.authTag, 24)}</dd>
                <dt className="font-sans text-muted-foreground">Wrapped key</dt>
                <dd className="break-all text-muted-foreground">
                  {shortMono(meta?.wrappedAesKey, 28)}
                </dd>
              </dl>
            ) : null}
          </div>

          {owned && onDelete ? (
            <SheetFooter className="border-t border-border">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(file.id);
                  onClose();
                }}
                className="w-fit"
              >
                Delete file
              </Button>
            </SheetFooter>
          ) : (
            <div className="mt-auto" />
          )}
        </SheetContent>
      </Sheet>

      {shareOpen && owned ? (
        <ShareModal
          file={file}
          onClose={() => {
            setShareOpen(false);
            void reload();
            onChanged?.();
          }}
          onShared={() => {
            void reload();
            onChanged?.();
          }}
        />
      ) : null}
    </>
  );
}
