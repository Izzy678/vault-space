import Link from "next/link";
import { ArrowRight, ChevronDown, FolderOpen, LockKeyhole } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { faqs, features } from "./content";
import { EncryptionJourney } from "./EncryptionJourney";
import { LandingBrand, LandingButton } from "./LandingUi";
import { WorkspacePreview } from "./WorkspacePreview";
import styles from "./landing.module.css";

const featureIcons = [FolderOpen, LockKeyhole];

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export function LandingContent() {
  return (
    <>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <ContainerScroll titleComponent={<div className={styles.heroCopy}>
            <h1 id="hero-title"><span className={styles.heroLead}>Your files.</span><span className={styles.heroEmphasis}>Encrypted before upload.</span></h1>
            <p className={styles.heroDescription}>Each file is encrypted in your browser. VaultSpace stores the encrypted file and a wrapped key, and does not decrypt file contents.</p>
            <div className={styles.heroActions}>
              <LandingButton href="/register">Create account</LandingButton>
              <LandingButton href="#how-it-works" secondary className={styles.heroSecondary}>See how it works <ArrowRight size={18} aria-hidden="true" /></LandingButton>
            </div>
            <p className={styles.heroNote}>Academic prototype. The workspace shown has a 50 MB storage quota. A lost vault passphrase cannot be recovered with a password reset.</p>
          </div>}>
            <WorkspacePreview />
          </ContainerScroll>
        </section>

        <section id="how-it-works" className={styles.section} aria-labelledby="workflow-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="workflow-title">From device to cloud.</h2>
              <p>Your browser encrypts the file. VaultSpace stores the encrypted result, and you retrieve it after unlocking the vault.</p>
            </div>
            <EncryptionJourney />
          </div>
        </section>

        <section id="security" className={`${styles.section} ${styles.securitySection}`} aria-labelledby="security-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="security-title">Your vault has its own secret.</h2>
              <p>Your vault passphrase unlocks the protected private key in your browser. It serves a different purpose from your login password. Keep it safe: a password reset does not recover your vault key.</p>
            </div>
          </div>
        </section>

        <section id="features" className={styles.section} aria-labelledby="features-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="features-title">Familiar storage.<br />Visible protection.</h2>
              <p>Upload, find, and retrieve files from a workspace that stays locked until you open the vault.</p>
            </div>
            <div className={styles.featureGrid}>
              {features.map(([title, body], index) => {
                const Icon = featureIcons[index];
                return (
                  <article key={title} className={styles.featureItem} data-reveal>
                    <div className={styles.featureTop} aria-hidden="true">
                      <Icon size={28} strokeWidth={1.5} />
                      <span>0{index + 1}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faq-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal><h2 id="faq-title">Before you create an account.</h2><p>A few practical details about files, keys, and your vault.</p></div>
            <div className={styles.faqList}>
              {faqs.map(([question, answer], index) => <details key={question} className={styles.faqItem} open={index === 0} data-reveal><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="cta-title">
          <div className={styles.container} data-reveal>
            <h2 id="cta-title">Create an account</h2>
            <p>You will choose a login password and a separate vault passphrase. Keep the passphrase. Resetting the password does not restore encrypted files.</p>
            <LandingButton href="/register">Create account</LandingButton>
            <Link href="/login" className={styles.signInLink}>Already have an account? Sign in</Link>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerContent}`}>
          <LandingBrand />
          <div><p>An academic prototype exploring hybrid encryption for secure cloud storage.</p><p className={styles.copyright}>© <CopyrightYear /> VaultSpace</p></div>
          <nav aria-label="Footer"><a href="#security">Security</a><Link href="/login">Sign in</Link></nav>
        </div>
      </footer>
    </>
  );
}
