import { asBufferSource, base64ToBuf, bufToBase64 } from "./bytes";
import { importPublicKeyPem, type UnlockedVault } from "./vault";

const STORAGE_KEY = "vaultspace.vaultSession";

const RSA_PARAMS: RsaHashedImportParams = {
  name: "RSA-OAEP",
  hash: "SHA-256",
};

type SessionBlob = {
  userId: string;
  publicKeyPem: string;
  fingerprint: string;
  /** Base64 PKCS#8 — tab session only; cleared on lock / sign-out / tab close */
  privateKeyPkcs8: string;
};

export async function saveVaultSession(
  userId: string,
  unlocked: UnlockedVault,
): Promise<void> {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", unlocked.privateKey);
  const blob: SessionBlob = {
    userId,
    publicKeyPem: unlocked.publicKeyPem,
    fingerprint: unlocked.fingerprint,
    privateKeyPkcs8: bufToBase64(pkcs8),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
}

export function clearVaultSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function restoreVaultSession(
  userId: string,
): Promise<UnlockedVault | null> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const blob = JSON.parse(raw) as SessionBlob;
    if (!blob?.privateKeyPkcs8 || blob.userId !== userId) {
      clearVaultSession();
      return null;
    }

    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      asBufferSource(base64ToBuf(blob.privateKeyPkcs8)),
      RSA_PARAMS,
      true,
      ["decrypt"],
    );
    const publicKey = await importPublicKeyPem(blob.publicKeyPem);

    return {
      publicKey,
      privateKey,
      publicKeyPem: blob.publicKeyPem,
      fingerprint: blob.fingerprint,
    };
  } catch {
    clearVaultSession();
    return null;
  }
}
