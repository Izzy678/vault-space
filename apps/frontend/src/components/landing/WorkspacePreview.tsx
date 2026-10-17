import Image from "next/image";
import styles from "./landing.module.css";

export function WorkspacePreview() {
  return (
    <figure className={styles.previewFigure} data-reveal>
      <a
        className={styles.productCapture}
        href="/images/product/vaultspace-desktop.jpg"
        target="_blank"
        rel="noreferrer"
        aria-label="View the VaultSpace desktop workspace at full size (opens in a new tab)"
      >
        <Image
          src="/images/product/vaultspace-desktop.jpg"
          alt="The VaultSpace dashboard showing file categories, storage usage, and an integrity-verified file."
          width={1440}
          height={560}
          className={styles.productCaptureImage}
          loading="eager"
          unoptimized
        />
      </a>
      <figcaption>The VaultSpace web app. Select the preview to view it at full size.</figcaption>
    </figure>
  );
}
