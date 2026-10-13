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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !shareOpen) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, shareOpen]);

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
      <button
        type="button"
        aria-label="Close file details"
        className="fixed inset-0 z-40 bg-[rgba(20,24,30,0.2)]"
        onClick={onClose}
      />

      <aside
        data-file-detail=""
        className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[400px] flex-col overflow-auto border-l border-[#e3e5e8] bg-white shadow-[-8px_0_24px_rgba(16,24,40,0.06)]"
        role="dialog"
        aria-modal="true"
        aria-label="File detail"
      >
        <div className="flex items-start justify-between gap-3 px-[22px] py-5">
          <div className="flex min-w-0 gap-3.5">
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[9px] bg-[#eceef0] font-mono text-[11px] font-medium text-app-text">
              {ext.slice(0, 4)}
            </div>
            <div className="min-w-0">
              <p className="break-words text-[15px] font-medium leading-snug text-app-text">
                {file.originalName}
              </p>
              <p className="mt-1 text-[12px] text-app-muted">
                {formatBytes(file.sizeBytes)} · {formatModified(file.uploadedAt)}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-lg text-app-muted hover:bg-[#eceef0]"
          >
            ×
          </button>
        </div>

        <div className="mx-[22px] flex items-center gap-2 rounded-lg bg-[oklch(0.8_0.13_165_/_0.08)] px-3 py-2.5 text-[13px] text-[oklch(0.42_0.11_165)]">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[oklch(0.72_0.14_165)]" />
          Encrypted end-to-end · AES-256-GCM
        </div>

        <div className="flex gap-2 px-[22px] py-4">
          <button
            type="button"
            onClick={() => onDownload(file)}
            className="h-[38px] flex-1 rounded-lg bg-app-primary text-sm font-semibold text-white hover:bg-app-primary-hover"
          >
            Download
          </button>
          {owned ? (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="h-[38px] flex-1 rounded-lg border border-[#d6d9de] text-sm font-medium text-app-text hover:bg-[#e8eaed]"
            >
              Share
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="px-[22px] pb-2 text-sm text-app-danger">{error}</p>
        ) : null}

        {owned ? (
          <div className="border-t border-[#e6e8eb] px-[22px] py-4">
            <p className="text-[12px] text-app-muted">People with access</p>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-[11px] font-semibold">
                  {contactInitials(fullNameFromUser(user))}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-app-text">
                    {fullNameFromUser(user)}
                  </p>
                  <p className="text-[11px] text-[#868d97]">Owner</p>
                </div>
              </li>
              {access.map((row) => (
                <li key={row.id} className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceef0] text-[11px] font-semibold">
                    {contactInitials(row.recipientName || row.recipientEmail)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-app-text">
                      {row.recipientName || row.recipientEmail}
                    </p>
                    <p className="text-[11px] text-[#868d97]">Can download</p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onRevoke(row.id)}
                    className="h-[26px] rounded-md border border-[#dcdfe3] px-2 text-[11px] text-app-muted hover:bg-app-bg"
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="border-t border-[#e6e8eb] px-[22px] py-4">
            <p className="text-[12px] text-app-muted">Shared with you</p>
            <p className="mt-2 text-[13px] text-app-text">
              You can download and decrypt this file with your vault key.
            </p>
          </div>
        )}

        <div className="border-t border-[#e6e8eb] px-[22px] py-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-app-muted">Encryption</span>
            <button
              type="button"
              onClick={() => setTechOpen((v) => !v)}
              className="text-[12px] text-[oklch(0.5_0.12_165)] hover:underline"
            >
              {techOpen ? "Hide details" : "Show details"}
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[12px]">
            <dt className="text-[#868d97]">Cipher</dt>
            <dd>{meta?.encryptionAlgo ?? "AES-256-GCM"}</dd>
            <dt className="text-[#868d97]">Wrapping</dt>
            <dd>{meta?.wrappingAlgo ?? "RSA-OAEP-SHA256"}</dd>
            <dt className="text-[#868d97]">Wrapped for</dt>
            <dd>{owned ? "Your vault key" : "Your shared key"}</dd>
          </dl>

          {techOpen ? (
            <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-lg border border-[#e6e8eb] bg-[#f6f7f8] p-3 font-mono text-[11px]">
              <dt className="font-sans text-[#868d97]">IV (96-bit)</dt>
              <dd className="break-all text-app-text">{shortMono(meta?.iv, 24)}</dd>
              <dt className="font-sans text-[#868d97]">Auth tag</dt>
              <dd className="break-all text-app-text">
                {shortMono(meta?.authTag, 24)}
              </dd>
              <dt className="font-sans text-[#868d97]">Wrapped key</dt>
              <dd className="break-all text-app-muted">
                {shortMono(meta?.wrappedAesKey, 28)}
              </dd>
            </dl>
          ) : null}
        </div>

        {owned && onDelete ? (
          <div className="mt-auto border-t border-[#e6e8eb] px-[22px] py-4">
            <button
              type="button"
              onClick={() => {
                onDelete(file.id);
                onClose();
              }}
              className="h-[34px] rounded-[7px] border border-[oklch(0.7_0.15_25_/_0.35)] px-3 text-[13px] text-[oklch(0.55_0.18_25)] hover:bg-app-danger-soft"
            >
              Delete file
            </button>
          </div>
        ) : (
          <div className="mt-auto" />
        )}
      </aside>

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
