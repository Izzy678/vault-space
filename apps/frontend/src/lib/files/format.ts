export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatModified(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) return `Today, ${time}`;

  return (
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }) +
    `, ${time}`
  );
}

export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "there";
  const part = local.split(/[._-]/)[0] ?? local;
  return part.charAt(0).toUpperCase() + part.slice(1);
}

type NamedUser = { name?: string | null; email?: string | null };

/** Prefer signup name; fall back to email local-part. */
export function displayNameFromUser(
  user: NamedUser | null | undefined,
  fallback = "there",
): string {
  const raw = user?.name?.trim();
  if (raw) return raw.split(/\s+/)[0] ?? raw;
  if (user?.email) return displayNameFromEmail(user.email);
  return fallback;
}

export function fullNameFromUser(
  user: NamedUser | null | undefined,
  fallback = "User",
): string {
  const raw = user?.name?.trim();
  if (raw) return raw;
  if (user?.email) return displayNameFromEmail(user.email);
  return fallback;
}

export function initialsFromUser(
  user: NamedUser | null | undefined,
  fallback = "U",
): string {
  const raw = user?.name?.trim();
  if (raw) {
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
    }
    return raw.slice(0, 1).toUpperCase();
  }
  if (user?.email) return displayNameFromEmail(user.email).slice(0, 1).toUpperCase();
  return fallback;
}

/** Per-account ciphertext quota (must match backend STORAGE_QUOTA_BYTES). */
export const STORAGE_QUOTA_BYTES = Number(
  process.env.NEXT_PUBLIC_STORAGE_QUOTA_BYTES ?? 50 * 1024 * 1024,
);
