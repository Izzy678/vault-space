import type { FileCategory } from "@/lib/files/types";

type FileKind = "pdf" | "word" | "spreadsheet" | "presentation" | "image" | "vector" | "audio" | "video" | "archive" | "text" | "other";

const FILE_STYLES: Record<FileKind, { color: string; label: string }> = {
  pdf: { color: "#DF4145", label: "PDF" },
  word: { color: "#2784D5", label: "DOC" },
  spreadsheet: { color: "#249867", label: "XLS" },
  presentation: { color: "#DE843B", label: "PPT" },
  image: { color: "#71A637", label: "IMG" },
  vector: { color: "#D48C3D", label: "SVG" },
  audio: { color: "#8A66B1", label: "MP3" },
  video: { color: "#E85C68", label: "MP4" },
  archive: { color: "#CE9641", label: "ZIP" },
  text: { color: "#738091", label: "TXT" },
  other: { color: "#87919D", label: "FILE" },
};

function fileKind(category: FileCategory, extension: string): FileKind {
  if (extension === "pdf") return "pdf";
  if (extension === "svg") return "vector";
  if (["doc", "docx", "pages", "odt"].includes(extension)) return "word";
  if (["xls", "xlsx", "csv", "ods"].includes(extension)) return "spreadsheet";
  if (["ppt", "pptx", "key", "odp"].includes(extension)) return "presentation";
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension) || category === "archives") return "archive";
  if (category === "images") return "image";
  if (category === "audio") return "audio";
  if (category === "videos") return "video";
  if (category === "documents") return "text";
  return "other";
}

function FileGlyph({ kind, color }: { kind: FileKind; color: string }) {
  switch (kind) {
    case "pdf":
      return (
        <path
          d="M16 7c-2 0-1 5.5 1.7 9.5 2 3 6 4.5 6.3 2.6.3-1.8-5.1-1.7-9.1-.4-4 1.3-7.2 3.4-6.3 4.5 1.3 1.5 5.4-4.8 6.8-8.8 1.5-4.2 2.5-7.4.6-7.4Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "word":
      return (
        <>
          <path d="M9 13l2.2 9 3-7 3 7 2.2-9" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M22 15h3m-3 3h3m-3 3h3" stroke={color} strokeOpacity="0.55" strokeWidth="1.3" />
        </>
      );
    case "spreadsheet":
      return (
        <>
          <rect x="8" y="12" width="17" height="12" rx="1" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M8 16h17M8 20h17m-11-8v12m5-12v12" stroke={color} strokeWidth="1" />
        </>
      );
    case "presentation":
      return (
        <>
          <rect x="8" y="12" width="17" height="11" rx="1" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M16.5 23v3m-4 0h8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 14a3.5 3.5 0 1 0 3.5 3.5H15V14Z" fill={color} fillOpacity="0.8" />
        </>
      );
    case "image":
      return (
        <>
          <rect x="7" y="12" width="19" height="13" rx="1.5" fill="#F0F5E8" />
          <circle cx="12" cy="15.5" r="2.2" fill="#E8C85C" />
          <path d="m7 24 6-6 4 4 4-7 5 9v1H7Z" fill={color} />
          <path d="m15 24 6-9 5 9v1H15Z" fill="#4E8963" />
        </>
      );
    case "audio":
      return (
        <>
          <path d="M14 21V11l10-2v10M14 14l10-2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="11.5" cy="22" rx="3.3" ry="2.2" fill={color} transform="rotate(-20 11.5 22)" />
          <ellipse cx="21.5" cy="20" rx="3.3" ry="2.2" fill={color} transform="rotate(-20 21.5 20)" />
        </>
      );
    case "vector":
      return <path d="m12 13-4 5 4 5m9-10 4 5-4 5m-3-11-4 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
    case "video":
      return (
        <>
          <circle cx="16.5" cy="17.5" r="7.5" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.2" />
          <path d="m14 13 7 4.5-7 4.5Z" fill={color} />
        </>
      );
    case "archive":
      return (
        <>
          <path d="M14 6h5v18h-5Z" fill={color} fillOpacity="0.15" />
          {[7, 11, 15, 19].map((y) => <path key={y} d={`M14 ${y}h3m0 2h2`} stroke={color} strokeWidth="1.8" />)}
          <rect x="14" y="23" width="5" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.3" />
        </>
      );
    default:
      return <path d="M9 13h15M9 17h15M9 21h10" stroke={color} strokeWidth="1.3" strokeLinecap="round" />;
  }
}

export function FileTypeIcon({ category, ext }: { category: FileCategory; ext: string }) {
  const extension = ext.toLowerCase();
  const kind = fileKind(category, extension);
  const { color: defaultColor, label: fallback } = FILE_STYLES[kind];
  const color = kind === "image" && ["jpg", "jpeg"].includes(extension) ? "#17A085" : defaultColor;
  const label = (extension || fallback).toUpperCase().slice(0, 4);

  return (
    <svg
      aria-hidden="true"
      data-file-kind={kind}
      className="h-7 w-6 shrink-0"
      width="24"
      height="28"
      viewBox="0 0 32 38"
      fill="none"
    >
      <path d="M6 1.5h14l9 9V33a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3Z" fill="#FAFAF8" stroke="#D9DDE0" />
      <path d="M20 1.5v6a3 3 0 0 0 3 3h6" fill="#E9ECEF" stroke="#D9DDE0" strokeLinejoin="round" />
      <FileGlyph kind={kind} color={color} />
      <rect x="1" y="28" width="30" height="9" rx="1.5" fill={color} />
      <text x="16" y="34.5" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontWeight="700" fontSize={label.length > 3 ? "6.8" : "7.5"}>
        {label}
      </text>
    </svg>
  );
}
