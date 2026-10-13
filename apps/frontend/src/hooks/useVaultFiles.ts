"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiBinary, apiJson, apiUpload } from "@/lib/api/client";
import { decryptFile, encryptFile } from "@/lib/crypto";
import { categorizeFile, summarizeByCategory } from "@/lib/files/categories";
import type { FileCategory, FileRow, QueueItem } from "@/lib/files/types";
import type { UnlockedVault } from "@/lib/crypto/vault";

export function useVaultFiles(
  token: string | null | undefined,
  unlocked: UnlockedVault | null | undefined,
) {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = useCallback(async () => {
    if (!token) return;
    const list = await apiJson<FileRow[]>("/files", { token });
    setFiles(list);
  }, [token]);

  useEffect(() => {
    if (!token || !unlocked) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        await loadFiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, unlocked, loadFiles]);

  const counts = useMemo(() => summarizeByCategory(files), [files]);
  const totalBytes = useMemo(
    () => files.reduce((n, f) => n + f.sizeBytes, 0),
    [files],
  );

  const filterFiles = useCallback(
    (opts: {
      search?: string;
      category?: FileCategory | "all";
      recentOnly?: boolean;
      limit?: number;
    }) => {
      const q = (opts.search ?? "").trim().toLowerCase();
      let list = [...files];

      if (opts.category && opts.category !== "all") {
        list = list.filter((f) => categorizeFile(f) === opts.category);
      }
      if (q) {
        list = list.filter((f) =>
          f.originalName.toLowerCase().includes(q),
        );
      }

      list.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      );

      if (opts.recentOnly || opts.limit) {
        list = list.slice(0, opts.limit ?? 20);
      }

      return list;
    },
    [files],
  );

  async function upload(fileList: FileList | null) {
    if (!fileList?.length || !token || !unlocked) return;
    setError(null);

    for (const file of Array.from(fileList)) {
      const update = (stage: string, errorMsg?: string) =>
        setQueue((q) => {
          const rest = q.filter((i) => i.name !== file.name);
          return [...rest, { name: file.name, stage, error: errorMsg }];
        });

      try {
        update("Encrypting");
        const enc = await encryptFile(file, unlocked.publicKey);
        update("Uploading");
        const form = new FormData();
        form.append("ciphertext", enc.ciphertext, `${file.name}.enc`);
        form.append("originalName", enc.originalName);
        form.append("mimeType", enc.mimeType);
        form.append("wrappedAesKey", enc.wrappedAesKey);
        form.append("iv", enc.iv);
        form.append("authTag", enc.authTag);
        await apiUpload("/files", form, token);
        update("Complete");
        await loadFiles();
      } catch (err) {
        update("Failed", err instanceof Error ? err.message : "Upload failed");
      }
    }
  }

  async function download(row: FileRow) {
    if (!token || !unlocked) return;
    setError(null);
    try {
      const meta = await apiJson<FileRow>(`/files/${row.id}`, { token });
      const ciphertext = await apiBinary(`/files/${row.id}/content`, token);
      const blob = await decryptFile(
        ciphertext,
        {
          wrappedAesKey: meta.wrappedAesKey!,
          iv: meta.iv!,
          authTag: meta.authTag!,
          mimeType: meta.mimeType,
        },
        unlocked.privateKey,
      );
      await apiJson(`/files/${row.id}/integrity`, {
        method: "POST",
        token,
        body: JSON.stringify({ verified: true }),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = row.originalName;
      a.click();
      URL.revokeObjectURL(url);
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      try {
        await apiJson(`/files/${row.id}/integrity`, {
          method: "POST",
          token,
          body: JSON.stringify({ verified: false }),
        });
      } catch {
        /* ignore */
      }
    }
  }

  async function remove(id: string) {
    if (!token) return;
    await apiJson(`/files/${id}`, { method: "DELETE", token });
    await loadFiles();
  }

  return {
    files,
    counts,
    totalBytes,
    error,
    queue,
    loading,
    filterFiles,
    upload,
    download,
    remove,
    reload: loadFiles,
  };
}
