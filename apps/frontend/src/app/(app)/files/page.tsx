"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeaderActions } from "@/components/app/AppShell";
import { CategoryCards } from "@/components/dashboard/CategoryCards";
import { RecentFilesTable } from "@/components/dashboard/RecentFilesTable";
import { FileDetailDrawer } from "@/components/files/FileDetailDrawer";
import { UploadButtons, UploadQueue } from "@/components/files/UploadButtons";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";
import { CATEGORY_META } from "@/lib/files/categories";
import { initialsFromUser } from "@/lib/files/format";
import type { FileCategory, FileRow } from "@/lib/files/types";
import {
  downloadSharedFile,
  fetchIncomingShares,
  type IncomingShare,
} from "@/lib/shares";

const VALID: FileCategory[] = [
  "images",
  "documents",
  "videos",
  "archives",
  "audio",
  "other",
];

type Selection =
  | { kind: "owned"; file: FileRow }
  | { kind: "shared"; file: FileRow; share: IncomingShare }
  | null;

function FilesContent() {
  const { user, token } = useAuth();
  const { unlocked } = useVault();
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("q") ?? "";
  const typeParam = searchParams.get("type");
  const {
    filterFiles,
    upload,
    download,
    remove,
    queue,
    error,
    counts,
    reload,
  } = useVaultFiles(token, unlocked);
  const [filter, setFilter] = useState<FileCategory | "all">("all");
  const [selection, setSelection] = useState<Selection>(null);
  const [incoming, setIncoming] = useState<IncomingShare[]>([]);
  const [shareError, setShareError] = useState<string | null>(null);

  const loadIncoming = useCallback(async () => {
    if (!token) return;
    const rows = await fetchIncomingShares(token);
    setIncoming(rows);
  }, [token]);

  useEffect(() => {
    void loadIncoming().catch(() => setIncoming([]));
  }, [loadIncoming]);

  useEffect(() => {
    if (typeParam && VALID.includes(typeParam as FileCategory)) {
      setFilter(typeParam as FileCategory);
    } else if (!typeParam) {
      setFilter("all");
    }
  }, [typeParam]);

  function onSelect(cat: FileCategory | "all") {
    setFilter(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("type");
    else params.set("type", cat);
    const qs = params.toString();
    router.replace(qs ? `/files?${qs}` : "/files");
  }

  const visible = useMemo(
    () => filterFiles({ search, category: filter }),
    [filterFiles, search, filter],
  );

  const sharedRows: FileRow[] = useMemo(
    () =>
      incoming
        .filter((s) => {
          const q = search.trim().toLowerCase();
          if (!q) return true;
          return s.originalName.toLowerCase().includes(q);
        })
        .map((s) => ({
          id: s.id,
          originalName: s.originalName,
          mimeType: s.mimeType,
          sizeBytes: s.sizeBytes,
          uploadedAt: s.uploadedAt,
          integrityVerified: s.integrityVerified,
        })),
    [incoming, search],
  );

  const initials = initialsFromUser(user);

  async function onDownloadShared(row: FileRow) {
    if (!token || !unlocked) return;
    const share = incoming.find((s) => s.id === row.id);
    if (!share) return;
    setShareError(null);
    try {
      await downloadSharedFile(token, unlocked, share);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Download failed");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:py-6">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-app-muted">My files</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-app-text sm:text-[22px]">
            All encrypted files
          </h1>
          <p className="mt-1 max-w-xl text-[13px] text-app-muted">
            Click a file to open details, share access, or download.
          </p>
        </div>
        <AppHeaderActions
          initials={initials}
          uploadSlot={<UploadButtons onUpload={(f) => void upload(f)} />}
        />
      </div>

      <UploadQueue queue={queue} />
      {error ? <p className="mt-4 text-sm text-app-danger">{error}</p> : null}
      {shareError ? (
        <p className="mt-4 text-sm text-app-danger">{shareError}</p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:max-w-3xl">
        <CategoryCards counts={counts} active={filter} onSelect={onSelect} />
      </div>

      <div className="mt-4">
        <RecentFilesTable
          title={filter === "all" ? "All files" : CATEGORY_META[filter].label}
          emptyMessage={
            search || filter !== "all"
              ? "No files match this filter."
              : "No encrypted files yet. Upload to get started."
          }
          files={visible}
          selectedId={selection?.kind === "owned" ? selection.file.id : null}
          onSelect={(f) => setSelection({ kind: "owned", file: f })}
        />
      </div>

      <div className="mt-6">
        <RecentFilesTable
          title="Shared with me"
          emptyMessage="Nothing shared with you yet."
          files={sharedRows}
          selectedId={selection?.kind === "shared" ? selection.file.id : null}
          onSelect={(f) => {
            const share = incoming.find((s) => s.id === f.id);
            if (!share) return;
            setSelection({ kind: "shared", file: f, share });
          }}
        />
      </div>

      {selection?.kind === "owned" ? (
        <FileDetailDrawer
          file={selection.file}
          mode="owned"
          onClose={() => setSelection(null)}
          onDownload={(f) => void download(f)}
          onDelete={(id) => {
            void remove(id);
            setSelection(null);
          }}
          onChanged={() => {
            void reload();
            void loadIncoming();
          }}
        />
      ) : null}

      {selection?.kind === "shared" ? (
        <FileDetailDrawer
          file={selection.file}
          mode="shared"
          onClose={() => setSelection(null)}
          onDownload={(f) => void onDownloadShared(f)}
        />
      ) : null}
    </div>
  );
}

export default function FilesPage() {
  return (
    <Suspense
      fallback={
        <div className="px-7 py-10 text-sm text-app-muted">Loading…</div>
      }
    >
      <FilesContent />
    </Suspense>
  );
}
