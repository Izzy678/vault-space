import Image from "next/image";
import styles from "./landing.module.css";

export function WorkspacePreview() {
  return (
    <a
      className={styles.productCapture}
      href="/images/product/vaultspace-desktop-2880.jpg"
      target="_blank"
      rel="noreferrer"
      aria-label="View the VaultSpace desktop workspace at full size (opens in a new tab)"
    >
      <Image
        src="/images/product/vaultspace-desktop-2880.jpg"
        alt="The VaultSpace dashboard showing file categories, storage usage, and an integrity-verified file."
        width={2880}
        height={1800}
        className={styles.productCaptureImage}
        loading="eager"
        draggable={false}
        unoptimized
      />
    </a>
  );
}
