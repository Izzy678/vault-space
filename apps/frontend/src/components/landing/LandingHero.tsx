"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const FILES = [
  { name: "Q4-board-deck.pdf", meta: "Encrypted · 2.4 MB" },
  { name: "passport-scan.enc", meta: "Shared · 1 contact" },
  { name: "tax-2025.zip", meta: "Locked · AES-256" },
];

function VaultPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[920px]">
      {/* Back pane — code / key material (Payload-style layering) */}
      <div
        className="absolute -left-3 top-8 hidden w-[42%] max-w-[340px] overflow-hidden rounded-2xl border border-nav-border bg-[var(--marketing-surface)] p-4 shadow-[0_24px_80px_rgb(0_0_0_/_28%)] md:block lg:-left-6"
        aria-hidden
      >
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--site-muted)]/50" />
          <span className="h-2 w-2 rounded-full bg-[var(--site-muted)]/50" />
          <span className="h-2 w-2 rounded-full bg-[var(--site-muted)]/50" />
          <span className="ml-2 font-mono text-[10px] text-[var(--site-muted)]">
            wrapped-key.json
          </span>
        </div>
        <pre className="font-mono text-[10px] leading-relaxed text-[var(--site-muted)]">
          {`{\n  "alg": "RSA-OAEP",\n  "kdf": "PBKDF2-SHA256",\n  "wrap": "AES-KW",\n  "ct": "a8f3…9c2e"\n}`}
        </pre>
      </div>

      {/* Front pane — vault UI */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-nav-border bg-[var(--marketing-glass)] shadow-[0_40px_120px_rgb(0_0_0_/_35%)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-nav-border px-4 py-3 md:px-5">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
              style={{
                background:
                  "color-mix(in srgb, var(--marketing-glow) 18%, transparent)",
                color: "var(--marketing-glow-bright)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <rect
                  x="2.5"
                  y="5.5"
                  width="9"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M4.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-semibold tracking-tight text-[var(--site-text)]">
                Personal vault
              </p>
              <p className="text-[11px] text-[var(--site-muted)]">
                Unlocked on this device
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              background:
                "color-mix(in srgb, var(--marketing-glow) 16%, transparent)",
              color: "var(--marketing-glow-bright)",
            }}
          >
            E2E active
          </span>
        </div>

        <ul className="divide-y divide-nav-border">
          {FILES.map((file) => (
            <li
              key={file.name}
              className="flex items-center justify-between gap-4 px-4 py-3.5 md:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-nav-border bg-[var(--marketing-surface)] text-[var(--site-muted)]">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M4 2.5h5.2L12 5.3V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--site-text)]">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-[var(--site-muted)]">{file.meta}</p>
                </div>
              </div>
              <span className="hidden text-[11px] text-[var(--site-muted)] sm:inline">
                Decrypt locally
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-nav-border bg-[var(--marketing-surface)] px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3 text-[11px] text-[var(--site-muted)]">
            <span>48.2 MB free of 50 MB</span>
            <span className="font-mono tracking-wide">AES-256-GCM</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-nav-border">
            <div
              className="h-full w-[4%] rounded-full"
              style={{ background: "var(--marketing-glow)" }}
            />
          </div>
        </div>
      </div>

      {/* Soft teal wash under the mock */}
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--marketing-glow-soft)" }}
        aria-hidden
      />
    </div>
  );
}

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--site-bg)]">
      {/* Full-bleed atmospheric plane — Payload grid + Launch UI glow + Crypgo energy */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 45% at 50% 0%, color-mix(in srgb, var(--site-text) 7%, transparent), transparent 55%),
              radial-gradient(ellipse 55% 40% at 70% 85%, var(--marketing-glow-soft), transparent 60%),
              radial-gradient(ellipse 40% 30% at 20% 70%, color-mix(in srgb, var(--marketing-glow) 10%, transparent), transparent 55%),
              linear-gradient(180deg, var(--site-bg) 0%, var(--site-bg) 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--marketing-grid) 1px, transparent 1px),
              linear-gradient(to bottom, var(--marketing-grid) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 35%, black 20%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.28] dark:opacity-[0.2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            mixBlendMode: "multiply",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-[42%] h-[50vmax] w-[70vmax] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--marketing-glow-soft), transparent 68%)",
          }}
          animate={
            reduce
              ? undefined
              : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.05, 1] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-5 pb-16 pt-24 md:px-8 md:pb-20 md:pt-28 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[920px] text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-nav-border px-3.5 py-1.5 text-[12px] font-medium tracking-wide"
            style={{
              background: "var(--marketing-glass)",
              color: "var(--marketing-glow-bright)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--marketing-glow)" }}
            />
            Client-side encryption
          </span>

          <p className="mt-7 font-[family-name:var(--font-landing-display)] text-[clamp(3.5rem,13vw,8.75rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-[var(--site-text)]">
            VaultSpace
          </p>

          <h1 className="mx-auto mt-6 max-w-[30ch] text-[clamp(1.2rem,2.4vw,1.7rem)] font-medium leading-snug tracking-tight text-[var(--site-text)] md:mt-8">
            Encrypt in your browser. Store ciphertext in the cloud.
          </h1>
          <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[17px]">
            Your vault passphrase never leaves the device. Keys stay wrapped.
            We only ever see encrypted bytes.
          </p>

          <div className="relative mt-10 inline-flex flex-wrap items-center justify-center gap-3">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: "var(--marketing-glow-soft)" }}
              aria-hidden
            />
            <Link
              href="/register"
              className="relative inline-flex h-12 items-center justify-center rounded-[10px] px-7 text-[14px] font-semibold transition-[transform,filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14 md:px-8"
              style={{
                background: "var(--marketing-glow)",
                color: "#041512",
              }}
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="relative inline-flex h-12 items-center justify-center rounded-[10px] border border-nav-btn-border bg-[var(--marketing-glass)] px-6 text-[14px] font-medium text-nav-text backdrop-blur-sm transition-colors hover:bg-nav-text/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-[12px] tracking-[0.12em] text-[var(--site-muted)]">
            END-TO-END · AES-256-GCM · RSA-OAEP
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-16"
        >
          <VaultPreview />
        </motion.div>
      </div>
    </section>
  );
}
