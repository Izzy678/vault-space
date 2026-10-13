import { asBufferSource, base64ToBuf, bufToBase64, sha256Hex } from "./bytes";

const RSA_PARAMS: RsaHashedKeyGenParams = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

export const DEFAULT_KDF_ITERATIONS = 310_000;

export type VaultPackagePayload = {
  publicKeyPem: string;
  fingerprint: string;
  wrappedPrivateKey: string;
  kdfSalt: string;
  kdfIterations: number;
  wrapIv: string;
};

export type UnlockedVault = {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyPem: string;
  fingerprint: string;
};

function spkiToPem(spki: ArrayBuffer): string {
  const b64 = bufToBase64(spki);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
}

export async function setupVault(
  passphrase: string,
  iterations = DEFAULT_KDF_ITERATIONS,
): Promise<{ payload: VaultPackagePayload; unlocked: UnlockedVault }> {
  const keyPair = await crypto.subtle.generateKey(RSA_PARAMS, true, [
    "encrypt",
    "decrypt",
  ]);

  const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const publicKeyPem = spkiToPem(spki);
  const fingerprint = (await sha256Hex(spki)).slice(0, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappingKey = await deriveKey(passphrase, salt, iterations);

  const wrapped = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBufferSource(iv) },
    wrappingKey,
    pkcs8,
  );

  const payload: VaultPackagePayload = {
    publicKeyPem,
    fingerprint,
    wrappedPrivateKey: bufToBase64(wrapped),
    kdfSalt: bufToBase64(salt),
    kdfIterations: iterations,
    wrapIv: bufToBase64(iv),
  };

  return {
    payload,
    unlocked: {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      publicKeyPem,
      fingerprint,
    },
  };
}

export async function unlockVault(
  passphrase: string,
  pkg: VaultPackagePayload,
): Promise<UnlockedVault> {
  const salt = base64ToBuf(pkg.kdfSalt);
  const iv = base64ToBuf(pkg.wrapIv);
  const wrapped = base64ToBuf(pkg.wrappedPrivateKey);
  const wrappingKey = await deriveKey(passphrase, salt, pkg.kdfIterations);

  let pkcs8: ArrayBuffer;
  try {
    pkcs8 = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: asBufferSource(iv) },
      wrappingKey,
      asBufferSource(wrapped),
    );
  } catch {
    throw new Error("Wrong vault passphrase or corrupted key package");
  }

  // extractable: true so the tab can re-hydrate after refresh via sessionStorage
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    RSA_PARAMS,
    true,
    ["decrypt"],
  );

  const publicKey = await importPublicKeyPem(pkg.publicKeyPem);

  return {
    publicKey,
    privateKey,
    publicKeyPem: pkg.publicKeyPem,
    fingerprint: pkg.fingerprint,
  };
}

export async function importPublicKeyPem(pem: string): Promise<CryptoKey> {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const spki = base64ToBuf(b64);
  return crypto.subtle.importKey(
    "spki",
    asBufferSource(spki),
    RSA_PARAMS,
    true,
    ["encrypt"],
  );
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: asBufferSource(salt),
      iterations,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
