"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Recent nav removed — keep route as redirect for old links. */
export default function RecentRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return <div className="px-7 py-10 text-sm text-app-muted">Loading…</div>;
}
