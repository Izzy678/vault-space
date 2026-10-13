"use client";

import { motion, useReducedMotion } from "motion/react";
import { LandingAtmosphere } from "./LandingAtmosphere";
import { EncryptFlowMock, UnlockMock, ShareMock } from "./ProductMocks";

const STEPS = [
  {
    n: "01",
    title: "Create your vault",
    body: "Sign up, then set a vault passphrase. That generates your keypair in the browser and wraps the private key so only you can unlock it.",
    mock: "unlock" as const,
  },
  {
    n: "02",
    title: "Encrypt before anything leaves",
    body: "Pick a file. AES-256-GCM seals it locally, the file key is wrapped with RSA-OAEP, and only ciphertext plus the wrapped key upload.",
    mock: "encrypt" as const,
  },
  {
    n: "03",
    title: "Unlock, download, or share",
    body: "Unlock with your passphrase on this device. Download decrypts locally. Share re-wraps a file key to a contact’s public key — never plaintext through us.",
    mock: "share" as const,
  },
];

function StepMock({ kind }: { kind: "unlock" | "encrypt" | "share" }) {
  if (kind === "unlock") return <UnlockMock />;
  if (kind === "encrypt") return <EncryptFlowMock />;
  return <ShareMock />;
}

export function LandingHowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-hidden border-t border-nav-border bg-[var(--site-bg)]"
    >
      <LandingAtmosphere wash="right" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[36rem]"
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--site-muted)]">
            How a file travels
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4.5vw,3.1rem)] font-semibold tracking-[-0.03em] text-[var(--site-text)]">
            Get set up once. Every file follows the same path.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--site-muted)] md:text-[16px]">
            Three steps from empty account to encrypted files you can open or
            share — the same flows you see inside the app.
          </p>
        </motion.div>

        <ol className="mt-16 space-y-20 md:mt-20 md:space-y-24">
          {STEPS.map((step, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.li
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: reduce ? 0 : 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="font-mono text-[13px] font-semibold tracking-[0.14em] text-[var(--site-muted)]">
                    {step.n}
                  </p>
                  <h3 className="mt-3 text-[22px] font-semibold tracking-tight text-[var(--site-text)] md:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-[var(--site-muted)]">
                    {step.body}
                  </p>
                </div>
                <div className="min-w-0">
                  <StepMock kind={step.mock} />
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
