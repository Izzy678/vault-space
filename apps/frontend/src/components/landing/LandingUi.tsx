import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  IconFolder, IconKey, IconLock, IconUpload, LogoMark,
} from "@/components/app/icons";
import { Button } from "@/components/ui/button";
import styles from "./landing.module.css";

export function LandingBrand() {
  return (
    <Link href="/" className={styles.brand} aria-label="VaultSpace home">
      <LogoMark className={styles.logoMark} />
      <span>VaultSpace</span>
    </Link>
  );
}

type LandingButtonProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  secondary?: boolean;
  small?: boolean;
};

export function LandingButton({ secondary, small, className, children, ...props }: LandingButtonProps) {
  return (
    <Button
      asChild
      variant={secondary ? "secondary" : "default"}
      className={[styles.button, secondary ? styles.secondaryButton : styles.primaryButton, small ? styles.smallButton : "", className].filter(Boolean).join(" ")}
    >
      <Link {...props}>{children}</Link>
    </Button>
  );
}

const icons = { folder: IconFolder, key: IconKey, lock: IconLock, upload: IconUpload };

export function LandingIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name];
  return <span className={styles.icon} aria-hidden="true"><Icon /></span>;
}

export function FileSecurityDetails({ fileName = "Research-notes.pdf" }: { fileName?: string }) {
  return (
    <div className={styles.fileSecurity} data-ui="file-security">
      <LandingIcon name="lock" />
      <p className={styles.inspectorFile}>{fileName}</p>
      <p className={styles.smallMuted}>File security</p>
      <dl className={styles.securityList}>
        <div><dt>File content</dt><dd>AES-256-GCM encrypted</dd></div>
        <div><dt>File key</dt><dd>RSA-OAEP protected</dd></div>
        <div><dt>Retrieval</dt><dd>Authentication + integrity checks</dd></div>
      </dl>
      <p className={styles.smallMuted}>Illustrative security details</p>
    </div>
  );
}
