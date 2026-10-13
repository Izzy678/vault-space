"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--site-bg)]">
      {/* Full-bleed atmospheric plane */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 60% at 50% 20%, color-mix(in srgb, var(--site-text) 8%, transparent), transparent 55%),
              radial-gradient(ellipse 70% 50% at 80% 80%, color-mix(in srgb, var(--site-text) 5%, transparent), transparent 50%),
              linear-gradient(180deg, var(--site-bg) 0%, var(--site-bg) 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            mixBlendMode: "multiply",
          }}
        />
        <motion.div
          className="absolute -left-[20%] top-[10%] h-[55vmax] w-[55vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--site-text) 6%, transparent), transparent 70%)",
          }}
          animate={
            reduce
              ? undefined
              : { x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[15%] bottom-[5%] h-[45vmax] w-[45vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--site-text) 5%, transparent), transparent 70%)",
          }}
          animate={
            reduce
              ? undefined
              : { x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-center px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[920px]"
        >
          <p
            className="font-[family-name:var(--font-landing-display)] text-[clamp(3.25rem,12vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--site-text)]"
          >
            VaultSpace
          </p>
          <h1 className="mt-6 max-w-[28ch] text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug tracking-tight text-[var(--site-text)] md:mt-8">
            Encrypt in your browser. Store ciphertext in the cloud.
          </h1>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[17px]">
            Your vault passphrase never leaves the device. Keys stay wrapped.
            We only ever see encrypted bytes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-nav-cta-bg px-6 text-[14px] font-semibold text-nav-cta-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14 md:px-7"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-nav-btn-border px-6 text-[14px] font-medium text-nav-text transition-colors hover:bg-nav-text/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="absolute bottom-8 left-5 text-[12px] tracking-wide text-[var(--site-muted)] md:left-8 lg:left-10"
        >
          End-to-end · AES-256-GCM · RSA-OAEP
        </motion.p>
      </div>
    </section>
  );
}
