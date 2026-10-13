import { asBufferSource, base64ToBuf, bufToBase64, concatBytes } from "./bytes";

export type EncryptedFilePackage = {
  ciphertext: Blob;
  wrappedAesKey: string;
  iv: string;
  authTag: string;
  originalName: string;
  mimeType: string;
};

/** WebCrypto AES-GCM returns ciphertext||tag; we split the last 16 bytes as authTag. */
export async function encryptFile(
  file: File,
  publicKey: CryptoKey,
): Promise<EncryptedFilePackage> {
  const plain = await file.arrayBuffer();
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: asBufferSource(iv) },
      aesKey,
      plain,
    ),
  );

  const tagLength = 16;
  const ciphertext = encrypted.slice(0, encrypted.length - tagLength);
  const authTag = encrypted.slice(encrypted.length - tagLength);

  const rawAes = await crypto.subtle.exportKey("raw", aesKey);
  const wrapped = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawAes,
  );

  return {
    ciphertext: new Blob([ciphertext], { type: "application/octet-stream" }),
    wrappedAesKey: bufToBase64(wrapped),
    iv: bufToBase64(iv),
    authTag: bufToBase64(authTag),
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
  };
}

/** Unwrap a file AES key with the owner's private key, re-wrap for a recipient. */
export async function rewrapAesKeyForRecipient(
  wrappedAesKeyB64: string,
  ownerPrivateKey: CryptoKey,
  recipientPublicKey: CryptoKey,
): Promise<string> {
  const rawAes = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    ownerPrivateKey,
    asBufferSource(base64ToBuf(wrappedAesKeyB64)),
  );
  const wrapped = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientPublicKey,
    rawAes,
  );
  return bufToBase64(wrapped);
}

export async function decryptFile(
  ciphertext: ArrayBuffer,
  meta: { wrappedAesKey: string; iv: string; authTag: string; mimeType: string },
  privateKey: CryptoKey,
): Promise<Blob> {
  const rawAes = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    asBufferSource(base64ToBuf(meta.wrappedAesKey)),
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAes,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const iv = asBufferSource(base64ToBuf(meta.iv));
  const authTag = base64ToBuf(meta.authTag);
  const body = new Uint8Array(ciphertext);
  const combined = concatBytes(body, authTag);

  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      asBufferSource(combined),
    );
    return new Blob([plain], { type: meta.mimeType });
  } catch {
    throw new Error("Decryption failed — integrity check did not pass");
  }
}
