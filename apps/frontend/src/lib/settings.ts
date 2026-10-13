export type AutolockOption = "5 min" | "15 min" | "1 hour" | "Never";

const AUTOLOCK_KEY = "vaultspace.autolock";

export const AUTOLOCK_OPTIONS: AutolockOption[] = [
  "5 min",
  "15 min",
  "1 hour",
  "Never",
];

export function getAutolock(): AutolockOption {
  if (typeof window === "undefined") return "15 min";
  const v = localStorage.getItem(AUTOLOCK_KEY);
  if (v === "5 min" || v === "15 min" || v === "1 hour" || v === "Never") {
    return v;
  }
  return "15 min";
}

export function setAutolock(value: AutolockOption) {
  localStorage.setItem(AUTOLOCK_KEY, value);
  window.dispatchEvent(new Event("vaultspace-autolock"));
}

export function autolockMs(value: AutolockOption): number | null {
  switch (value) {
    case "5 min":
      return 5 * 60 * 1000;
    case "15 min":
      return 15 * 60 * 1000;
    case "1 hour":
      return 60 * 60 * 1000;
    case "Never":
      return null;
  }
}

export function formatFingerprint(fp: string): string {
  const clean = fp.replace(/\s+/g, "").toUpperCase();
  return clean.match(/.{1,4}/g)?.join(" ") ?? fp;
}

export function deviceLabel(): string {
  if (typeof navigator === "undefined") return "Web";
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Safari\//.test(ua)
        ? "Safari"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : "Browser";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad/.test(ua)
          ? "iOS"
          : "Desktop";
  return `${browser} · ${os}`;
}
