"use client";

import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    n: "01",
    title: "Create your vault",
    body: "Sign up, then set a vault passphrase. That generates your keypair and wraps the private key in the browser.",
  },
  {
    n: "02",
    title: "Encrypt & upload",
    body: "Pick files. They’re encrypted locally, then ciphertext and wrapped keys are stored.",
  },
  {
    n: "03",
    title: "Unlock when you need them",
    body: "Unlock with your passphrase, download, and decrypt on device. Share by re-wrapping keys to contacts.",
  },
];

export function LandingHowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-nav-border bg-[var(--site-bg)] px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-[1100px]">
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
            Workflow
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            How it works
          </h2>
          <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            Three steps from empty account to encrypted files in the cloud.
          </p>
        </motion.div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative rounded-2xl border border-nav-border bg-[var(--marketing-surface)] p-6 md:p-7"
            >
              <p
                className="font-mono text-[13px] font-semibold tracking-[0.14em]"
                style={{ color: "var(--marketing-glow-bright)" }}
              >
                {step.n}
              </p>
              <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-[var(--site-text)] md:text-[19px]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-muted)] md:text-[15px]">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
