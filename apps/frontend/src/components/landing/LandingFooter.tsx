"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { LandingAtmosphere } from "./LandingAtmosphere";

export function LandingFooter() {
  const reduce = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-nav-border bg-[var(--site-bg)]">
      <LandingAtmosphere wash="bottom" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-20 md:px-8 md:py-24 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-[family-name:var(--font-landing-display)] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
              Start your vault
            </p>
            <p className="mt-3 max-w-[36ch] text-[15px] text-[var(--site-muted)]">
              Create an account, set a passphrase, and encrypt your first file
              in the browser — same product chrome you just saw.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-[10px] bg-nav-cta-bg px-7 text-[14px] font-semibold text-nav-cta-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-focus active:scale-[0.98]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-[10px] border border-nav-btn-border px-6 text-[14px] font-medium text-nav-text transition-colors hover:bg-nav-text/5"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-nav-border pt-8 text-[13px] text-[var(--site-muted)]">
          <p className="font-medium text-[var(--site-text)]">VaultSpace</p>
          <div className="flex flex-wrap gap-5">
            <a href="#features" className="hover:text-[var(--site-text)]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[var(--site-text)]">
              How it works
            </a>
            <a href="#security" className="hover:text-[var(--site-text)]">
              Security
            </a>
            <a href="#faq" className="hover:text-[var(--site-text)]">
              FAQ
            </a>
            <Link href="/login" className="hover:text-[var(--site-text)]">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
