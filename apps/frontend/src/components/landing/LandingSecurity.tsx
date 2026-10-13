"use client";

import { motion, useReducedMotion } from "motion/react";

export function LandingSecurity() {
  const reduce = useReducedMotion();

  return (
    <section
      id="security"
      className="scroll-mt-20 border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Zero-knowledge by design
          </h2>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            Login gets you into the account. The vault passphrase unlocks
            encryption keys locally. Losing the vault passphrase means we
            cannot recover your files — and neither can anyone else.
          </p>
        </motion.div>

        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 border-l border-nav-border pl-6 md:pl-8"
        >
          <div>
            <dt className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--site-muted)]">
              Cipher
            </dt>
            <dd className="mt-1 text-[17px] font-medium text-[var(--site-text)]">
              AES-256-GCM
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--site-muted)]">
              Key wrapping
            </dt>
            <dd className="mt-1 text-[17px] font-medium text-[var(--site-text)]">
              RSA-OAEP · SHA-256
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--site-muted)]">
              Passphrase KDF
            </dt>
            <dd className="mt-1 text-[17px] font-medium text-[var(--site-text)]">
              PBKDF2-SHA256
            </dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
