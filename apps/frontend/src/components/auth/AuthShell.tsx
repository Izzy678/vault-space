"use client";

import Link from "next/link";
import { useId, type ComponentProps, type ReactNode } from "react";
import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck, UserPlus } from "lucide-react";
import { LogoMark } from "@/components/app/icons";
import { brandFont } from "@/components/brand/font";
import { SecretInput } from "@/components/ui/secret-input";
import styles from "./auth.module.css";

type AuthStage = "login" | "register" | "verify" | "setup" | "unlock";
const stageIcons = { login: LockKeyhole, register: UserPlus, verify: ShieldCheck, setup: KeyRound, unlock: KeyRound };
const protections = [
  { icon: LockKeyhole, label: "Encrypt the file" },
  { icon: KeyRound, label: "Protect the key" },
  { icon: ShieldCheck, label: "Verify on retrieval" },
];

export function AuthShell({ title, subtitle, children, footer, stage = "login" }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  stage?: AuthStage;
}) {
  const Icon = stageIcons[stage];
  return (
    <div className={`${brandFont.variable} ${styles.root}`} data-stage={stage}>
      <a href="#auth-main" className={styles.skipLink}>Skip to form</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="VaultSpace home"><LogoMark className={styles.logo} /><span>VaultSpace</span></Link>
        <Link href="/" className={styles.backLink}><ArrowLeft size={15} aria-hidden="true" />Back to home</Link>
      </header>
      <div className={styles.content}>
        <aside className={styles.intro} aria-label="Your files, protected">
          <p className={styles.eyebrow}><span />A little space. A lot of protection.</p>
          <h2>Your files.<br /><span>In safe hands.</span></h2>
          <p className={styles.description}>A private space for the things that matter. With protection built in, from your browser to the cloud.</p>
          <div className={styles.protections}>
            {protections.map(({ icon: ProtectionIcon, label }) => <div key={label}><span className={styles.protectionIcon}><ProtectionIcon size={22} strokeWidth={1.5} aria-hidden="true" /></span><p>{label}</p></div>)}
          </div>
          <p className={styles.encryptionNote}>AES-256-GCM file encryption <span>·</span> RSA-OAEP key protection</p>
        </aside>
        <main id="auth-main" className={styles.main}>
          <div className={styles.formPanel}>
            <span className={styles.formIcon} data-stage={stage}><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span>
            <h1>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <div className={styles.formContent}>{children}</div>
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </div>
        </main>
      </div>
      <footer className={styles.pageFooter}><p><ShieldCheck size={14} aria-hidden="true" />Encryption starts on your device.</p><span>VaultSpace · Academic prototype</span></footer>
    </div>
  );
}

export function AuthField({ label, children }: { label: string; children: ReactNode }) {
  return <label className={styles.field}><span>{label}</span><div className={styles.fieldInput}>{children}</div></label>;
}

export function AuthSecretField({ label, secretLabel, ...props }: {
  label: string;
  secretLabel?: string;
} & Omit<ComponentProps<"input">, "type" | "className">) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.fieldInput}><SecretInput id={id} secretLabel={secretLabel ?? label.toLowerCase()} className={`${styles.input} ${styles.secretInput}`} {...props} /></div>
    </div>
  );
}

export function AuthNotice({ children }: { children: ReactNode }) {
  return <p className={styles.notice}><ShieldCheck size={16} aria-hidden="true" /><span>{children}</span></p>;
}

export function AuthLoading() {
  return <AuthShell title="Preparing your vault" stage="unlock"><p className={styles.loading} role="status">Loading your secure workspace…</p></AuthShell>;
}

export const authInputClass = styles.input;
export const authPrimaryBtnClass = styles.primaryButton;
export const authLinkClass = styles.link;
export const authPasswordRulesClass = styles.passwordRequirements;
