"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeaderActions } from "@/components/app/AppShell";
import { CategoryCards } from "@/components/dashboard/CategoryCards";
import { RecentFilesTable } from "@/components/dashboard/RecentFilesTable";
import { UploadButtons, UploadQueue } from "@/components/files/UploadButtons";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";
import { CATEGORY_META } from "@/lib/files/categories";
import { initialsFromUser } from "@/lib/files/format";
import type { FileCategory } from "@/lib/files/types";

const VALID: FileCategory[] = [
  "images",
  "documents",
  "videos",
  "archives",
  "audio",
  "other",
];

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
  } = useVaultFiles(token, unlocked);
  const [filter, setFilter] = useState<FileCategory | "all">("all");

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

  const initials = initialsFromUser(user);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:py-6">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-app-muted">My files</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-app-text sm:text-[22px]">
            All encrypted files
          </h1>
          <p className="mt-1 max-w-xl text-[13px] text-app-muted">
            Browse everything in your vault. Filter by type or search from the
            sidebar.
          </p>
        </div>
        <AppHeaderActions
          initials={initials}
          uploadSlot={<UploadButtons onUpload={(f) => void upload(f)} />}
        />
      </div>

      <UploadQueue queue={queue} />
      {error ? <p className="mt-4 text-sm text-app-danger">{error}</p> : null}

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
          onDownload={(f) => void download(f)}
          onDelete={(id) => void remove(id)}
        />
      </div>
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
