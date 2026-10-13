"use client";

import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    title: "Encrypt before upload",
    body: "Files are sealed with AES-256-GCM in the browser. The server stores ciphertext and wrapped keys — never your passphrase.",
  },
  {
    title: "Share without giving up the vault",
    body: "Re-wrap a file key to a contact’s public key. They decrypt with their vault; you never send plaintext through us.",
  },
  {
    title: "Authenticator 2FA",
    body: "Lock the account behind TOTP. Vault passphrase and login password stay separate on purpose.",
  },
];

export function LandingFeatures() {
  const reduce = useReducedMotion();

  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Built for private storage
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            The product is the vault workflow — not another drive with a
            privacy sticker.
          </p>
        </motion.div>

        <ul className="mt-14 divide-y divide-nav-border border-y border-nav-border">
          {FEATURES.map((feature, i) => (
            <motion.li
              key={feature.title}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid gap-3 py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:gap-10 md:py-10"
            >
              <h3 className="text-[18px] font-semibold tracking-tight text-[var(--site-text)] md:text-[20px]">
                {feature.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
                {feature.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
