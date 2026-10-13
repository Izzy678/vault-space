"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Replaced by /keys */
export default function VaultRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/keys");
  }, [router]);
  return <div className="px-7 py-10 text-sm text-app-muted">Loading…</div>;
}
