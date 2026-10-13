"use client";

import { motion, useReducedMotion } from "motion/react";

const SPECS = [
  { label: "Cipher", value: "AES-256-GCM" },
  { label: "Key wrapping", value: "RSA-OAEP · SHA-256" },
  { label: "Passphrase KDF", value: "PBKDF2-SHA256" },
];

export function LandingSecurity() {
  const reduce = useReducedMotion();

  return (
    <section
      id="security"
      className="relative scroll-mt-20 overflow-hidden border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--marketing-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--marketing-grid) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 80% 50%, black, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-[12px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "var(--marketing-glow-bright)" }}
          >
            Security
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
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
          transition={{
            duration: 0.5,
            delay: reduce ? 0 : 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative overflow-hidden rounded-2xl border border-nav-border bg-[var(--marketing-glass)] p-6 shadow-[0_24px_80px_rgb(0_0_0_/_20%)] backdrop-blur-md md:p-8"
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl"
            style={{ background: "var(--marketing-glow-soft)" }}
            aria-hidden
          />
          <div className="relative space-y-6">
            {SPECS.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--site-muted)]">
                  {spec.label}
                </dt>
                <dd className="mt-1.5 font-mono text-[16px] font-medium tracking-tight text-[var(--site-text)] md:text-[17px]">
                  {spec.value}
                </dd>
              </div>
            ))}
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
