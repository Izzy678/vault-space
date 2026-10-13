"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeaderActions } from "@/components/app/AppShell";
import { CategoryCards } from "@/components/dashboard/CategoryCards";
import { RecentFilesTable } from "@/components/dashboard/RecentFilesTable";
import { StorageCard } from "@/components/dashboard/StorageCard";
import { FileDetailDrawer } from "@/components/files/FileDetailDrawer";
import { UploadButtons, UploadQueue } from "@/components/files/UploadButtons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import {
  displayNameFromUser,
  initialsFromUser,
  greetingForNow,
} from "@/lib/files/format";
import type { FileCategory, FileRow } from "@/lib/files/types";

function DashboardContent() {
  const { user, token } = useAuth();
  const { unlocked } = useVault();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const {
    filterFiles,
    upload,
    download,
    remove,
    queue,
    error,
    counts,
    totalBytes,
    reload,
  } = useVaultFiles(token, unlocked);
  const [filter, setFilter] = useState<FileCategory | "all">("all");
  const [selected, setSelected] = useState<FileRow | null>(null);

  const visible = useMemo(
    () =>
      filterFiles({
        search,
        category: filter,
        recentOnly: true,
        limit: 12,
      }),
    [filterFiles, search, filter],
  );

  const firstName = displayNameFromUser(user);
  const initials = initialsFromUser(user);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:py-6">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-app-muted">Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-app-text sm:text-[22px]">
            {greetingForNow()}, {firstName}!
          </h1>
          <p className="mt-1 max-w-xl text-[13px] text-app-muted">
            Overview of your encrypted storage. Click a file for details and
            sharing.
          </p>
        </div>
        <AppHeaderActions
          initials={initials}
          uploadSlot={<UploadButtons onUpload={(f) => void upload(f)} />}
        />
      </div>

      <UploadQueue queue={queue} />
      {error ? <p className="mt-4 text-sm text-app-danger">{error}</p> : null}

      <div className="mt-5 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,160px))_minmax(360px,1fr)]">
        <CategoryCards counts={counts} active={filter} onSelect={setFilter} />
        <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-1">
          <StorageCard counts={counts} totalBytes={totalBytes} />
        </div>
      </div>

      <div className="mt-4">
        <RecentFilesTable
          title="Recent files"
          files={visible}
          selectedId={selected?.id}
          onSelect={setSelected}
        />
      </div>

      {selected ? (
        <FileDetailDrawer
          file={selected}
          mode="owned"
          onClose={() => setSelected(null)}
          onDownload={(f) => void download(f)}
          onDelete={(id) => {
            void remove(id);
            setSelected(null);
          }}
          onChanged={() => void reload()}
        />
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="px-7 py-10 text-sm text-app-muted">Loading…</div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
