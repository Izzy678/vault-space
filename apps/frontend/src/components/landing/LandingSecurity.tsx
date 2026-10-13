"use client";

import { motion, useReducedMotion } from "motion/react";
import { LandingAtmosphere } from "./LandingAtmosphere";
import { KeyMaterialMock } from "./ProductMocks";

const SPECS = [
  { label: "File cipher", value: "AES-256-GCM" },
  { label: "Key wrapping", value: "RSA-OAEP · SHA-256" },
  { label: "Passphrase KDF", value: "PBKDF2-SHA256" },
];

const NEVER = [
  "Your vault passphrase",
  "Unwrapped private keys",
  "File plaintext",
];

const STORES = [
  "Ciphertext blobs",
  "Wrapped file keys",
  "Account email & auth",
];

export function LandingSecurity() {
  const reduce = useReducedMotion();

  return (
    <section
      id="security"
      className="relative scroll-mt-20 overflow-hidden border-t border-nav-border bg-[var(--site-bg)]"
    >
      <LandingAtmosphere wash="bottom" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--site-muted)]">
              Proof
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.1rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
              Zero-knowledge by design
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
              Login opens the account. The vault passphrase unwraps keys on your
              device. If you lose that passphrase, we cannot recover your files
              — and neither can anyone else.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-nav-border bg-[var(--marketing-surface)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--site-muted)]">
                  We never see
                </p>
                <ul className="mt-3 space-y-2">
                  {NEVER.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13px] text-[var(--site-text)]"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--site-muted)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-nav-border bg-[var(--marketing-surface)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--site-muted)]">
                  We store
                </p>
                <ul className="mt-3 space-y-2">
                  {STORES.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13px] text-[var(--site-text)]"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--site-muted)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {SPECS.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--site-muted)]">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] font-medium text-[var(--site-text)]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <KeyMaterialMock />
            <p className="mt-3 text-center text-[12px] text-[var(--site-muted)]">
              What lands on the server looks like this — wrapped material, not
              your secrets.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
