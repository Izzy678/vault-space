"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { LandingAtmosphere } from "./LandingAtmosphere";
import { HeroProductStack } from "./ProductMocks";

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[var(--site-bg)]">
      <LandingAtmosphere wash="left" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-12 px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-10 lg:px-10 lg:pb-28 lg:pt-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[540px]"
        >
          <p className="font-[family-name:var(--font-landing-display)] text-[clamp(2.75rem,6vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--site-text)]">
            VaultSpace
          </p>
          <h1 className="mt-5 text-[clamp(1.35rem,2.8vw,1.85rem)] font-medium leading-snug tracking-tight text-[var(--site-text)]">
            Encrypt in your browser.
            <span className="block text-[var(--site-muted)]">
              Store only ciphertext in the cloud.
            </span>
          </h1>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            Your vault passphrase never leaves the device. File keys stay
            wrapped. We only ever see encrypted bytes — the same product you
            unlock after sign-in.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-nav-cta-bg px-6 text-[14px] font-semibold text-nav-cta-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98] md:h-14 md:px-7"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-nav-btn-border bg-[var(--marketing-glass)] px-6 text-[14px] font-medium text-nav-text backdrop-blur-sm transition-colors hover:bg-nav-text/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98]"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-[11px] font-medium tracking-[0.14em] text-[var(--site-muted)]">
            END-TO-END · AES-256-GCM · RSA-OAEP
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-w-0"
        >
          <HeroProductStack />
        </motion.div>
      </div>
    </section>
  );
}
