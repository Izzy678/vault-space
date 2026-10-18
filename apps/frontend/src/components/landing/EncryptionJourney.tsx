"use client";

import { useId, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, Cloud, FileText, KeyRound, Laptop, LockKeyhole, ShieldCheck } from "lucide-react";
import { uploadSteps } from "./content";
import styles from "./encryption-journey.module.css";

const stages = [
  { icon: FileText, color: "var(--landing-blue)", label: "It starts on your device.", detail: "Your file is selected locally. A fresh encryption key is generated for this upload.", tag: "Ready to encrypt", short: "Select file" },
  { icon: LockKeyhole, color: "var(--landing-purple)", label: "Readable only with the key.", detail: "The file becomes ciphertext in your browser, before it leaves your device.", tag: "AES-256-GCM", short: "Encrypt content" },
  { icon: KeyRound, color: "var(--landing-purple)", label: "A separate layer for your key.", detail: "Your public key wraps the file’s encryption key, protecting it separately from the content.", tag: "RSA-OAEP", short: "Protect key" },
  { icon: Cloud, color: "var(--landing-green)", label: "Protected before it reaches the cloud.", detail: "The encrypted content, wrapped key, and required metadata are uploaded together.", tag: "Encrypted upload", short: "Store securely" },
] as const;

export function EncryptionJourney() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const stage = stages[active];
  const StageIcon = stage.icon;

  return (
    <div className={styles.journey} data-reveal>
      <div className={styles.layout}>
        <ol className={styles.steps} aria-label="Explore the upload process">
          {uploadSteps.map((step, index) => {
            const Icon = stages[index].icon;
            return (
              <li key={step.title}>
                <button type="button" className={styles.step} aria-pressed={active === index} aria-controls={panelId} onClick={() => setActive(index)} style={{ "--step-accent": stages[index].color } as CSSProperties}>
                  <span className={styles.stepIcon}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /></span>
                  <span className={styles.stepCopy}>
                    <span className={styles.stepTitle}><span className={styles.desktopTitle}>{step.title}</span><span className={styles.mobileTitle}>{stages[index].short}</span></span>
                    <span className={styles.stepDescription}>{step.body}</span>
                  </span>
                  <ArrowRight className={styles.stepArrow} size={17} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>

        <div id={panelId} className={styles.visual} style={{ "--journey-accent": stage.color } as CSSProperties} data-stage={active}>
          <div className={styles.visualHeader}><span className={styles.browserLabel}><LockKeyhole size={13} aria-hidden="true" /> Inside your browser</span><span className={styles.stageCount}>0{active + 1} <span>/ 04</span></span></div>
          <div className={styles.diagram} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.orbitInner} />
            <div className={styles.connection} />
            <motion.div key={`packet-${active}`} className={styles.packet} initial={{ left: "15%", opacity: 0 }} animate={{ left: "85%", opacity: [0, 1, 1, 0] }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeInOut" }} />
            <div className={`${styles.endpoint} ${styles.device}`}><span><Laptop size={25} strokeWidth={1.4} /></span><small>Your device</small></div>
            <div className={styles.fileStack}>
              <div className={styles.fileBack} />
              <div className={styles.fileMiddle} />
              <motion.div className={styles.file} key={`file-${active}`} initial={reduceMotion ? false : { y: 8, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
                <span className={styles.fileFold} />
                <span className={styles.fileGlyph}><StageIcon size={35} strokeWidth={1.35} /></span>
                <span className={styles.fileLines} data-encrypted={active > 0}><i /><i /><i /><i /></span>
                <span className={styles.fileSeal}>{active === 0 ? <FileText size={14} /> : <Check size={14} />}</span>
              </motion.div>
            </div>
            <div className={`${styles.endpoint} ${styles.cloud}`}><span><Cloud size={27} strokeWidth={1.4} /></span><small>Cloud storage</small></div>
            <span className={styles.protocol}><StageIcon size={13} />{stage.tag}</span>
          </div>
          <div className={styles.caption} role="status" aria-live="polite" aria-atomic="true">
            <p className={styles.captionTitle}>{stage.label}</p>
            <p className={styles.captionBody}>{stage.detail}</p>
          </div>
          <div className={styles.visualFooter}><span>Original file</span><ArrowRight size={14} aria-hidden="true" /><span>Protected result</span></div>
        </div>
      </div>

      <div className={styles.retrieval}>
        <span className={styles.retrievalIcon}><ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" /></span>
        <div><h3>Retrieve with the same care.</h3><p>Unlock your vault to recover the file key in your browser. AES-GCM decrypts the content and checks its integrity before returning the original file.</p></div>
        <ArrowDown className={styles.returnArrow} size={20} aria-hidden="true" />
      </div>
    </div>
  );
}
