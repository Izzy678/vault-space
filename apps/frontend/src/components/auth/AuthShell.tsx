"use client";

import Link from "next/link";
import { useId, type ComponentProps, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/app/icons";
import { brandFont } from "@/components/brand/font";
import { SecretInput } from "@/components/ui/secret-input";
import styles from "./auth.module.css";

type AuthStage = "login" | "register" | "verify" | "setup" | "unlock";

export function AuthShell({ title, subtitle, children, footer, stage = "login" }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  stage?: AuthStage;
}) {
  return (
    <div className={`${brandFont.variable} ${styles.root}`} data-stage={stage}>
      <a href="#auth-main" className={styles.skipLink}>Skip to form</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="VaultSpace home"><LogoMark className={styles.logo} /><span>VaultSpace</span></Link>
        <Link href="/" className={styles.backLink}><ArrowLeft size={15} aria-hidden="true" />Back to home</Link>
      </header>
      <div className={styles.content}>
        <main id="auth-main" className={styles.main}>
          <div className={styles.formPanel}>
            <h1>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <div className={styles.formContent}>{children}</div>
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </div>
        </main>
      </div>
      <footer className={styles.pageFooter}><span>VaultSpace · Academic prototype</span></footer>
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
  return <p className={styles.notice}>{children}</p>;
}

export function AuthLoading() {
  return <AuthShell title="Preparing your vault" stage="unlock"><p className={styles.loading} role="status">Loading your vault…</p></AuthShell>;
}

export const authInputClass = styles.input;
export const authPrimaryBtnClass = styles.primaryButton;
export const authLinkClass = styles.link;
export const authPasswordRulesClass = styles.passwordRequirements;
