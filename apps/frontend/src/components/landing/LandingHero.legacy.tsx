"use client";

/**
 * LEGACY landing hero (orbit flow field).
 * Kept as a fallback — restore by importing `LandingHeroLegacy` in `app/page.tsx`
 * instead of the new `LandingHero`.
 */
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { HeroFlowField } from "@/components/landing/hero.legacy/HeroFlowField";

export function LandingHeroLegacy() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[min(100dvh,920px)] flex-col overflow-hidden bg-[var(--site-bg)]">
      <HeroFlowField />

      {/* Keep the copy readable while letting the orbit show through. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse at center, color-mix(in srgb, var(--site-bg) 96%, transparent) 0%, color-mix(in srgb, var(--site-bg) 80%, transparent) 35%, transparent 72%),
            linear-gradient(180deg, transparent 65%, var(--site-bg) 100%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-1 flex-col items-center justify-center px-5 py-16 text-center md:px-8 md:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-accent md:text-[12px]">
            Encrypted cloud storage
          </p>
          <h1 className="text-[36px] font-semibold leading-[1.1] tracking-tight text-[var(--site-text)] md:text-[64px] lg:text-[72px]">
            Your files. Protected
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            at every step.
          </h1>
          <p className="mx-auto mt-5 max-w-[540px] text-[16px] leading-relaxed text-[var(--site-muted)] md:text-[18px]">
            Store your files privately in the cloud. Unlock your vault and
            retrieve them whenever you need them.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 min-w-[168px] items-center justify-center rounded-full border border-nav-btn-border bg-nav-btn-bg px-6 text-[13px] font-medium tracking-[0.04em] text-nav-text backdrop-blur-sm transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 min-w-[168px] items-center justify-center rounded-full bg-nav-cta-bg px-6 text-[13px] font-semibold tracking-[0.04em] text-nav-cta-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14"
            >
              Create account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
