"use client";

import { useState } from "react";
import type { FileRow } from "@/lib/files/types";
import { categorizeFile, CATEGORY_META, getExtension } from "@/lib/files/categories";
import { formatBytes, formatModified } from "@/lib/files/format";
import { IconMore } from "@/components/app/icons";
import { FileTypeIcon } from "./FileTypeIcon";

export function RecentFilesTable({
  files,
  onDownload,
  onDelete,
  onShare,
  title = "Recent files",
  emptyMessage = "No encrypted files yet. Upload to encrypt in your browser and store ciphertext securely.",
  showShare = true,
  showDelete = true,
}: {
  files: FileRow[];
  onDownload: (file: FileRow) => void;
  onDelete?: (id: string) => void;
  onShare?: (file: FileRow) => void;
  title?: string;
  emptyMessage?: string;
  showShare?: boolean;
  showDelete?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const headingId = "files-table-heading";

  return (
    <section aria-labelledby={headingId} className="rounded-[12px] border border-app-border bg-app-surface shadow-app">
      <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
        <h2 id={headingId} className="text-sm font-medium">
          {title}
        </h2>
        <span className="text-xs font-medium text-app-accent">
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
      </div>

      {files.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-app-muted">
          {emptyMessage}
        </p>
      ) : (
        <table className="w-full table-fixed text-left text-[13px] leading-5">
          <thead>
            <tr className="border-b border-app-border text-[11px] font-semibold uppercase tracking-wide text-app-muted-2">
              <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Name</th>
              <th scope="col" className="hidden w-24 px-3 py-2.5 font-semibold md:table-cell">Type</th>
              <th scope="col" className="w-20 px-2 py-2.5 font-semibold sm:w-24 sm:px-3">Size</th>
              <th scope="col" className="hidden w-40 px-3 py-2.5 font-semibold md:table-cell">Modified</th>
              <th scope="col" className="w-11 px-2 py-2.5 text-right font-semibold sm:w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const cat = categorizeFile(file);
              const ext = getExtension(file.originalName);
              return (
                <tr
                  key={file.id}
                  className="border-b border-app-border/80 last:border-0 hover:bg-app-bg/60"
                >
                  <td className="px-3 py-2 sm:px-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileTypeIcon category={cat} ext={ext} />
                      <div className="min-w-0 flex-1">
                        <p title={file.originalName} className="truncate font-medium leading-[18px] text-app-text">
                          {file.originalName}
                        </p>
                        <p className="truncate text-[11px] leading-4 text-app-muted md:hidden">
                          {CATEGORY_META[cat].label} · {formatModified(file.uploadedAt)}
                        </p>
                        {file.integrityVerified === true ? (
                          <p className="text-[11px] leading-4 text-app-success">
                            Integrity verified
                          </p>
                        ) : file.integrityVerified === false ? (
                          <p className="text-[11px] leading-4 text-app-danger">
                            Verify failed
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 text-app-muted md:table-cell">
                    {CATEGORY_META[cat].label}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-app-muted sm:px-3">
                    {formatBytes(file.sizeBytes)}
                  </td>
                  <td className="hidden px-3 py-2.5 text-app-muted md:table-cell">
                    {formatModified(file.uploadedAt)}
                  </td>
                  <td className="relative px-2 py-2.5 text-right sm:px-4">
                    <button
                      type="button"
                      aria-label="File actions"
                      aria-expanded={openId === file.id}
                      onClick={() =>
                        setOpenId((id) => (id === file.id ? null : file.id))
                      }
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-app-muted hover:bg-app-bg hover:text-app-text"
                    >
                      <IconMore />
                    </button>
                    {openId === file.id ? (
                      <div className="absolute right-2 z-20 mt-1 w-36 rounded-[10px] border border-app-border bg-app-surface py-1 text-left shadow-app sm:right-4">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-app-bg"
                          onClick={() => {
                            setOpenId(null);
                            onDownload(file);
                          }}
                        >
                          Download
                        </button>
                        {showShare && onShare ? (
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-app-bg"
                            onClick={() => {
                              setOpenId(null);
                              onShare(file);
                            }}
                          >
                            Share
                          </button>
                        ) : null}
                        {showDelete && onDelete ? (
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm text-app-danger hover:bg-app-danger-soft"
                            onClick={() => {
                              setOpenId(null);
                              onDelete(file.id);
                            }}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {files.length > 0 ? (
        <div className="flex items-center justify-between border-t border-app-border px-4 py-2.5 text-xs text-app-muted">
          <span>
            {files.length} files ·{" "}
            {formatBytes(files.reduce((n, f) => n + f.sizeBytes, 0))} ciphertext
          </span>
        </div>
      ) : null}
    </section>
  );
}
