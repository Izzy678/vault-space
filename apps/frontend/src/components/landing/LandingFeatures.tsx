"use client";

import { motion, useReducedMotion } from "motion/react";

const PILLARS = [
  {
    title: "Encrypt before upload",
    body: "AES-256-GCM in the browser. Ciphertext and wrapped keys go to the cloud — your passphrase does not.",
  },
  {
    title: "Share by re-wrapping keys",
    body: "Hand a contact a file they can decrypt with their vault. No shared passphrase. No plaintext relay.",
  },
  {
    title: "Two secrets on purpose",
    body: "Login password opens the account. Vault passphrase unlocks keys locally. Optional TOTP on the account.",
  },
  {
    title: "Honest 50 MB vault",
    body: "Quota is clear in the sidebar. What you store is encrypted bytes — same numbers you see after sign-in.",
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
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--site-muted)]">
            Product
          </p>
          <h2 className="mt-3 max-w-[20ch] font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.1rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Built for private storage
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            The same charcoal chrome, buttons, and vault rules you meet after
            you sign in — explained before you create an account.
          </p>
        </motion.div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-nav-border bg-nav-border sm:grid-cols-2">
          {PILLARS.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-[var(--site-bg)] p-6 md:p-8"
            >
              <h3 className="text-[17px] font-semibold tracking-tight text-[var(--site-text)] md:text-[18px]">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-muted)] md:text-[15px]">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
