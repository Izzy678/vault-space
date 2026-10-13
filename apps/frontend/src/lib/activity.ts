import { apiJson } from "./api/client";
import { deviceLabel } from "./settings";

export type ActivityType =
  | "upload"
  | "download"
  | "share"
  | "key"
  | "auth"
  | "delete";

export type ActivityRow = {
  id: string;
  type: ActivityType;
  label: string;
  fileName: string | null;
  device: string | null;
  createdAt: string;
};

export async function fetchActivity(
  token: string,
  type?: string,
): Promise<ActivityRow[]> {
  const q = type && type !== "all" ? `?type=${encodeURIComponent(type)}` : "";
  return apiJson<ActivityRow[]>(`/activity${q}`, { token });
}

export async function logActivity(
  token: string,
  type: ActivityType,
  label: string,
  fileName?: string,
) {
  try {
    await apiJson("/activity", {
      method: "POST",
      token,
      body: JSON.stringify({
        type,
        label,
        fileName,
        device: deviceLabel(),
      }),
    });
  } catch {
    /* non-blocking */
  }
}
