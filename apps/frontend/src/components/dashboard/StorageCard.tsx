import type { FileCategory } from "@/lib/files/types";
import { CATEGORY_META } from "@/lib/files/categories";
import { formatBytes, STORAGE_QUOTA_BYTES } from "@/lib/files/format";

const BAR_ORDER: FileCategory[] = [
  "documents",
  "images",
  "videos",
  "archives",
];

const DOT: Record<FileCategory, string> = {
  images: "bg-app-cat-images",
  documents: "bg-app-cat-documents",
  videos: "bg-app-cat-videos",
  archives: "bg-app-cat-archives",
  audio: "bg-app-cat-audio",
  other: "bg-app-cat-other",
};

export function StorageCard({
  counts,
  totalBytes,
}: {
  counts: Record<FileCategory, { count: number; bytes: number }>;
  totalBytes: number;
}) {
  const pct = Math.min(100, Math.round((totalBytes / STORAGE_QUOTA_BYTES) * 100));
  const categories = counts.other.bytes > 0 ? [...BAR_ORDER, "other" as const] : BAR_ORDER;
  const segments = categories.map((cat) => ({
    cat,
    pct: (counts[cat].bytes / Math.max(STORAGE_QUOTA_BYTES, totalBytes)) * 100,
  }));

  return (
    <section
      aria-label="Storage overview"
      className="flex h-full min-h-[190px] flex-col overflow-hidden rounded-[12px] border border-app-border bg-app-surface leading-[18px] shadow-app"
    >
      <h2 className="border-b border-app-border px-3 py-2 text-[13px] font-normal text-app-muted">
        Storage overview
      </h2>

      <div className="flex-1 px-3 pb-2.5 pt-2.5">
        <p className="text-lg font-medium leading-6 tracking-tight text-app-text">
          {formatBytes(totalBytes).replace(/ (KB|MB|GB)$/, "$1")}{" "}
          <span className="text-[13px] font-normal tracking-normal text-app-muted">
            of {formatBytes(STORAGE_QUOTA_BYTES).replace(/\.0 (KB|MB|GB)$/, "$1")}
          </span>
        </p>

        <div
          role="meter"
          aria-label="Storage used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={`${formatBytes(totalBytes)} of ${formatBytes(STORAGE_QUOTA_BYTES)}`}
          className="mt-2.5 flex h-2.5 overflow-hidden rounded-[5px] bg-app-bg"
        >
          {segments.map(({ cat, pct: seg }) =>
            seg > 0 ? (
              <div
                key={cat}
                className={`h-full ${DOT[cat]}`}
                style={{ width: `${seg}%` }}
                title={CATEGORY_META[cat].label}
              />
            ) : null,
          )}
        </div>

        <ul className="mt-2.5 grid grid-cols-1 gap-x-5 gap-y-1 text-[13px] sm:grid-cols-2">
          {categories.map((cat) => (
            <li key={cat} className="flex min-w-0 items-center gap-2 text-app-muted">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-[3px] shadow-sm ${DOT[cat]}`} />
              <span>{CATEGORY_META[cat].label}</span>
              <span className="ml-auto pl-1 tabular-nums">
                {formatBytes(counts[cat].bytes).replace(/ (KB|MB|GB)$/, "$1")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-app-border px-3 py-2 text-[13px] text-app-muted">
        {pct >= 100
          ? "Storage full — delete files to upload more."
          : pct >= 90
            ? `${pct}% storage used — almost at the ${formatBytes(STORAGE_QUOTA_BYTES)} limit.`
            : `${pct}% storage used of ${formatBytes(STORAGE_QUOTA_BYTES)} account quota.`}
      </p>
    </section>
  );
}
