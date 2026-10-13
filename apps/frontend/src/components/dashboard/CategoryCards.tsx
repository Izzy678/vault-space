import type { FileCategory } from "@/lib/files/types";
import { CATEGORY_META } from "@/lib/files/categories";
import { IconFolderLarge } from "@/components/app/icons";

const SHOW: FileCategory[] = ["images", "documents", "videos"];

export function CategoryCards({
  counts,
  active,
  onSelect,
}: {
  counts: Record<FileCategory, { count: number; bytes: number }>;
  active: FileCategory | "all";
  onSelect: (cat: FileCategory | "all") => void;
}) {
  return (
    <>
      {SHOW.map((cat) => {
        const meta = CATEGORY_META[cat];
        const selected = active === cat;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(selected ? "all" : cat)}
            className={`flex h-[190px] min-w-0 flex-col rounded-[12px] border bg-app-surface p-3 text-left shadow-app transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-focus ${cat === "videos" ? "col-span-2 sm:col-span-1" : ""} ${
              selected
                ? "border-app-focus ring-2 ring-app-focus/20"
                : "border-app-border hover:border-app-focus/40"
            }`}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <IconFolderLarge
                gradId={`folderGrad-${cat}`}
                className="h-[108px] w-[112px] max-w-full shrink-0"
              />
            </div>
            <div className="mt-auto pt-2">
              <p className="text-sm font-normal text-app-text">
                {meta.label}
              </p>
              <p className="mt-0.5 text-[13px] leading-5 text-app-muted">
                {counts[cat].count}{" "}
                {counts[cat].count === 1 ? "file" : "files"}
              </p>
            </div>
          </button>
        );
      })}
    </>
  );
}
