"use client";

import { useRef } from "react";
import { IconUpload } from "@/components/app/icons";

export function UploadButtons({
  onUpload,
}: {
  onUpload: (files: FileList | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onUpload(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-app-border bg-app-surface px-3 text-xs font-medium text-app-text shadow-app transition hover:bg-app-bg"
      >
        <IconUpload />
        Upload
      </button>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="inline-flex h-8 items-center gap-1 rounded-[10px] bg-app-primary px-3.5 text-xs font-semibold text-white transition hover:bg-app-primary-hover"
      >
        + Encrypt & upload
      </button>
    </>
  );
}

export function UploadQueue({
  queue,
}: {
  queue: { name: string; stage: string; error?: string }[];
}) {
  if (queue.length === 0) return null;
  return (
    <ul className="mt-4 space-y-1 rounded-[var(--app-radius-sm)] border border-app-border bg-app-surface px-4 py-3 text-sm shadow-app">
      {queue.map((item) => (
        <li key={item.name} className="flex justify-between gap-3">
          <span className="truncate text-app-text">{item.name}</span>
          <span
            className={
              item.error ? "text-app-danger" : "shrink-0 text-app-muted"
            }
          >
            {item.error ?? item.stage}
          </span>
        </li>
      ))}
    </ul>
  );
}
