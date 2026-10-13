"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    q: "What happens if I forget my vault passphrase?",
    a: "We cannot recover it. The passphrase unwraps your private key locally. Without it, ciphertext in the cloud stays unreadable — by design. Keep a secure backup of the passphrase.",
  },
  {
    q: "Is the login password the same as the vault passphrase?",
    a: "No. Login authenticates your account. The vault passphrase unlocks encryption keys in the browser. They stay separate on purpose so a stolen session password still cannot decrypt files.",
  },
  {
    q: "What does the server actually store?",
    a: "Encrypted file bytes, wrapped AES keys, IVs, auth tags, and account metadata (email, auth). It never receives your vault passphrase or unwrapped private key.",
  },
  {
    q: "How does sharing work without sending plaintext?",
    a: "You re-wrap the file’s AES key to your contact’s RSA public key in the browser. They unlock their vault and unwrap that key locally. We only store the new wrapped key and ciphertext.",
  },
  {
    q: "Do you support two-factor authentication?",
    a: "Yes. You can enable TOTP authenticator 2FA on the account. That protects sign-in; the vault passphrase still protects decryption keys.",
  },
  {
    q: "What is the storage limit?",
    a: "Each account has a 50 MB encrypted storage quota. Usage is shown in the app sidebar the same way you see it after signing in.",
  },
];

export function LandingFAQ() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--site-muted)]">
            Questions
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.1rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Know what you hold before you start
          </h2>
          <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[var(--site-muted)]">
            Passphrases, sharing, 2FA, and what we can — and cannot — see.
          </p>
        </motion.div>

        <ul className="divide-y divide-nav-border border-y border-nav-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-[var(--site-text)]"
                >
                  <span className="text-[15px] font-medium leading-snug text-[var(--site-text)] md:text-[16px]">
                    {item.q}
                  </span>
                  <span
                    className={`mt-0.5 shrink-0 text-[18px] leading-none text-[var(--site-muted)] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-8 text-[14px] leading-relaxed text-[var(--site-muted)] md:text-[15px]">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
