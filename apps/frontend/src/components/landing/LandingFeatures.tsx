"use client";

import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    title: "Encrypt before upload",
    body: "Files are sealed with AES-256-GCM in the browser. The server stores ciphertext and wrapped keys — never your passphrase.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M4 10.5V6.2A4.2 4.2 0 0 1 10 2.2a4.2 4.2 0 0 1 6 4v4.3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <rect
          x="3.5"
          y="9.5"
          width="13"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="10" cy="13.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Share without giving up the vault",
    body: "Re-wrap a file key to a contact’s public key. They decrypt with their vault; you never send plaintext through us.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="6.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="13.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M3 16c.6-2.2 2.2-3.5 3.5-3.5S9.4 13.8 10 16M10 16c.6-2.2 2.2-3.5 3.5-3.5S16.4 13.8 17 16"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Authenticator 2FA",
    body: "Lock the account behind TOTP. Vault passphrase and login password stay separate on purpose.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="4"
          width="13"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M7 10.5h6M7 13h4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="10" cy="7.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export function LandingFeatures() {
  const reduce = useReducedMotion();

  return (
    <section
      id="features"
      className="relative scroll-mt-20 overflow-hidden border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "var(--marketing-glow-soft)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1100px]">
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
            Product
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Built for private storage
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            The product is the vault workflow — not another drive with a
            privacy sticker.
          </p>
        </motion.div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {FEATURES.map((feature, i) => (
            <motion.li
              key={feature.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-2xl border border-nav-border bg-[var(--marketing-glass)] p-6 backdrop-blur-sm md:p-7"
            >
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-nav-border"
                style={{
                  background:
                    "color-mix(in srgb, var(--marketing-glow) 12%, transparent)",
                  color: "var(--marketing-glow-bright)",
                }}
              >
                {feature.icon}
              </span>
              <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-[var(--site-text)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-muted)] md:text-[15px]">
                {feature.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
