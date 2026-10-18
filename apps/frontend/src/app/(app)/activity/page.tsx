"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchActivity,
  type ActivityRow,
  type ActivityType,
} from "@/lib/activity";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upload", label: "Uploads" },
  { id: "share", label: "Shares" },
  { id: "download", label: "Downloads" },
  { id: "key", label: "Keys" },
  { id: "auth", label: "Sign-ins" },
];

const DOT: Record<ActivityType, string> = {
  upload: "bg-app-success",
  share: "bg-app-cat-images",
  download: "bg-app-muted",
  key: "bg-app-warning",
  auth: "bg-app-subtle",
  delete: "bg-app-danger",
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    ", " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  );
}

export default function ActivityPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchActivity(token, filter);
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  const visible = useMemo(() => rows, [rows]);

  return (
      <div className="flex w-full max-w-[1100px] flex-col gap-5 px-7 py-7 pb-[60px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-app-text">
              Activity
            </h1>
            <p className="mt-1 text-sm text-app-muted">
              Every encryption, key and access event on your account.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === f.id
                    ? "border-app-border bg-app-accent-soft text-app-text"
                    : "border-transparent text-app-muted hover:bg-app-bg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-app-danger">{error}</p> : null}

        <div className="overflow-hidden rounded-[12px] border border-app-border bg-app-surface">
          {loading ? (
            <p className="px-4 py-10 text-center text-sm text-app-muted">
              Loading…
            </p>
          ) : visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-app-muted">
              No activity yet. Upload a file or unlock your vault to start the
              log.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-app-border text-[11px] font-semibold uppercase tracking-wide text-app-muted-2">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-app-border/80 last:border-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-app-muted">
                        {formatWhen(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-app-text">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${DOT[row.type]}`}
                          />
                          {row.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-app-muted">
                        {row.fileName || "—"}
                      </td>
                      <td className="px-4 py-3 text-app-muted">
                        {row.device || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
