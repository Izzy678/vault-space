"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Replaced by /settings */
export default function AccountRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings");
  }, [router]);
  return <div className="px-7 py-10 text-sm text-app-muted">Loading…</div>;
}
