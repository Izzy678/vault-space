import type { FileCategory, FileRow } from "./types";

const DOC_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "md",
  "rtf",
  "pages",
]);

const ARCHIVE_EXT = new Set(["zip", "rar", "7z", "tar", "gz", "tgz", "bz2"]);

export function getExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function categorizeFile(
  file: Pick<FileRow, "originalName" | "mimeType">,
): FileCategory {
  const mime = file.mimeType.toLowerCase();
  const ext = getExtension(file.originalName);

  if (
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext)
  ) {
    return "images";
  }
  if (
    mime.startsWith("video/") ||
    ["mp4", "mov", "webm", "mkv", "avi"].includes(ext)
  ) {
    return "videos";
  }
  if (
    mime.includes("zip") ||
    mime.includes("compressed") ||
    mime.includes("archive") ||
    ARCHIVE_EXT.has(ext)
  ) {
    return "archives";
  }
  if (
    mime.startsWith("audio/") ||
    ["mp3", "wav", "aac", "flac", "m4a", "ogg"].includes(ext)
  ) {
    return "audio";
  }
  if (
    mime.includes("pdf") ||
    mime.includes("document") ||
    mime.includes("sheet") ||
    mime.includes("presentation") ||
    mime.startsWith("text/") ||
    DOC_EXT.has(ext)
  ) {
    return "documents";
  }
  return "other";
}

export const CATEGORY_META: Record<
  FileCategory,
  { label: string; colorClass: string; softClass: string; dotClass: string }
> = {
  documents: {
    label: "Documents",
    colorClass: "text-app-cat-documents",
    softClass: "bg-app-cat-documents/10",
    dotClass: "bg-app-cat-documents",
  },
  images: {
    label: "Images",
    colorClass: "text-app-cat-images",
    softClass: "bg-app-cat-images/10",
    dotClass: "bg-app-cat-images",
  },
  videos: {
    label: "Videos",
    colorClass: "text-app-cat-videos",
    softClass: "bg-app-cat-videos/10",
    dotClass: "bg-app-cat-videos",
  },
  archives: {
    label: "Archives",
    colorClass: "text-app-cat-archives",
    softClass: "bg-app-cat-archives/10",
    dotClass: "bg-app-cat-archives",
  },
  audio: {
    label: "Audio",
    colorClass: "text-app-cat-audio",
    softClass: "bg-app-cat-audio/10",
    dotClass: "bg-app-cat-audio",
  },
  other: {
    label: "Other",
    colorClass: "text-app-cat-other",
    softClass: "bg-app-cat-other/10",
    dotClass: "bg-app-cat-other",
  },
};

/** Sidebar file-type order from prototype */
export const SIDEBAR_FILE_TYPES: FileCategory[] = [
  "documents",
  "images",
  "videos",
  "archives",
];

export function summarizeByCategory(files: FileRow[]) {
  const counts: Record<FileCategory, { count: number; bytes: number }> = {
    images: { count: 0, bytes: 0 },
    documents: { count: 0, bytes: 0 },
    videos: { count: 0, bytes: 0 },
    archives: { count: 0, bytes: 0 },
    audio: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };

  for (const file of files) {
    const cat = categorizeFile(file);
    counts[cat].count += 1;
    counts[cat].bytes += file.sizeBytes;
  }

  return counts;
}
