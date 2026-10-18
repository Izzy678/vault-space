import Link from "next/link";
import { ArrowRight, ChevronDown, FolderOpen, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { capabilities, faqs, features } from "./content";
import { EncryptionJourney } from "./EncryptionJourney";
import { LandingBrand, LandingButton, LandingIcon } from "./LandingUi";
import { WorkspacePreview } from "./WorkspacePreview";
import styles from "./landing.module.css";

const featureIcons = [FolderOpen, KeyRound, LockKeyhole, ShieldCheck];
const capabilityIcons = [LockKeyhole, KeyRound, ShieldCheck];

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
            <h1 id="hero-title"><span className={styles.heroLead}>Your files.</span><span className={styles.heroEmphasis}>Protected at every step.</span></h1>
            <p className={styles.heroDescription}>Secure cloud storage with browser-side file encryption,<br className={styles.desktopBreak} /> separate key protection, and verified retrieval.</p>
            <div className={styles.heroActions}>
              <LandingButton href="/register">Create account</LandingButton>
              <LandingButton href="#how-it-works" secondary className={styles.heroSecondary}>See how it works <ArrowRight size={18} aria-hidden="true" /></LandingButton>
            </div>
            <p className={styles.heroNote}>AES-256-GCM file encryption · RSA-OAEP key protection</p>
          </div>}>
            <WorkspacePreview />
          </ContainerScroll>
        </section>

        <section className={styles.capabilities} aria-label="Core file protection">
          <div className={`${styles.container} ${styles.capabilityGrid}`}>
            {capabilities.map(([title, body], index) => {
              const Icon = capabilityIcons[index];
              return (
                <div key={title} className={styles.capabilityCard} data-reveal>
                  <span className={styles.capabilityTile} aria-hidden="true"><Icon className={styles.capabilityIcon} size={25} strokeWidth={1.5} /></span>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="features" className={styles.section} aria-labelledby="features-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="features-title">Familiar storage.<br />Visible protection.</h2>
              <p>Manage the files you need through a straightforward workspace, with protection built into upload and retrieval.</p>
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

        <section id="how-it-works" className={styles.section} aria-labelledby="workflow-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="workflow-title">From device to cloud.</h2>
              <p>Your browser handles encryption. The system stores the protected result for authorised retrieval.</p>
            </div>
            <EncryptionJourney />
          </div>
        </section>

        <section id="security" className={`${styles.section} ${styles.securitySection}`} aria-labelledby="security-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal>
              <h2 id="security-title">Two methods. One workflow.</h2>
              <p>File content and file keys have different roles. VaultSpace uses a different encryption method for each.</p>
            </div>
            <div className={styles.securityMethods}>
              <div data-reveal>
                <div className={styles.methodPreview} data-ui="content-encryption"><LandingIcon name="lock" /><p>Encrypted file content</p><span>AES-256-GCM</span></div>
                <h3>AES protects the content.</h3>
                <p>Fast symmetric encryption handles the file data. A newly generated key is used for every upload.</p>
              </div>
              <div data-reveal>
                <div className={styles.methodPreview} data-ui="key-protection"><LandingIcon name="key" /><p>Protected file key</p><span>RSA-OAEP · SHA-256</span></div>
                <h3>RSA protects the file key.</h3>
                <p>Asymmetric encryption wraps the AES key. Your unlocked private key recovers it for file retrieval.</p>
              </div>
            </div>
            <div className={styles.passphrase} data-reveal>
              <h3>Your vault has its own secret.</h3>
              <p>Your vault passphrase unlocks the protected private key in your browser. It serves a different purpose from your login password. Keep it safe: a password reset does not recover your vault key.</p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faq-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal><h2 id="faq-title">Before you make space.</h2><p>A few practical details about files, keys, and your vault.</p></div>
            <div className={styles.faqList}>
              {faqs.map(([question, answer], index) => <details key={question} className={styles.faqItem} open={index === 0} data-reveal><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="cta-title">
          <div className={styles.container} data-reveal>
            <h2 id="cta-title">Make room for what matters.</h2>
            <p>Create an account and start your secure file workspace.</p>
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
