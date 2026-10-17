"use client";

import { useState } from "react";
import { IconFolder } from "@/components/app/icons";
import { sampleFiles } from "./content";
import { FileSecurityDetails, LandingButton } from "./LandingUi";
import styles from "./landing.module.css";

export function WorkspacePreview() {
  const [selected, setSelected] = useState<string>(sampleFiles[0].name);

  return (
    <figure className={styles.previewFigure} data-reveal>
      <div className={styles.workspace} data-ui="workspace-preview" aria-label="Illustrative VaultSpace workspace">
        <div className={styles.workspaceToolbar}>
          <span>My files</span>
          <span className={styles.previewSearch}>Search your files</span>
          <LandingButton href="/register" small aria-label="Create an account to upload files">Upload files</LandingButton>
        </div>
        <div className={styles.workspaceBody}>
          <div className={styles.workspaceSidebar} aria-hidden="true">
            {["My files", "Recent", "Shared with me", "Activity", "Vault & keys"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className={styles.fileList} aria-label="Select a sample file">
            {sampleFiles.map((file) => (
              <button
                type="button"
                key={file.name}
                className={styles.fileRow}
                onClick={() => setSelected(file.name)}
                aria-pressed={selected === file.name}
                aria-label={`Preview ${file.name}`}
              >
                <span className={styles.fileIcon} aria-hidden="true"><IconFolder /></span>
                <span className={styles.fileCopy}>
                  <span>{file.name}</span>
                  <span className={styles.fileMeta}>{file.type} · {file.size}</span>
                </span>
                <span className={styles.fileStatus}>Encrypted</span>
              </button>
            ))}
          </div>
          <div className={styles.previewInspector} aria-live="polite" aria-atomic="true">
            <FileSecurityDetails fileName={selected} />
          </div>
          <div className={styles.mobileSecurity} aria-live="polite" aria-atomic="true">
            <p className={styles.smallMuted}>{selected}</p>
            <p>File encrypted. Key protected.</p>
            <p className={styles.smallMuted}>AES-GCM + RSA-OAEP</p>
          </div>
        </div>
      </div>
      <figcaption>Illustrative workspace · Sample files shown</figcaption>
    </figure>
  );
}
