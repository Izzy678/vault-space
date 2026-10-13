import { apiBinary, apiJson } from "./api/client";
import { decryptFile, importPublicKeyPem, rewrapAesKeyForRecipient } from "./crypto";
import type { UnlockedVault } from "./crypto/vault";
import type { ContactRow } from "./contacts";

export type OutgoingShare = {
  id: string;
  fileId: string;
  originalName: string;
  permission: string;
  recipientEmail: string;
  recipientName: string | null;
  createdAt: string;
};

export type IncomingShare = {
  id: string;
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  permission: string;
  ownerEmail: string;
  ownerName: string | null;
  createdAt: string;
  uploadedAt: string;
  integrityVerified: boolean | null;
  shared: true;
};

export type FileAccessRow = {
  id: string;
  recipientEmail: string;
  recipientName: string | null;
  permission: string;
  createdAt: string;
};

export function fetchOutgoingShares(token: string) {
  return apiJson<OutgoingShare[]>("/shares/outgoing", { token });
}

export function fetchIncomingShares(token: string) {
  return apiJson<IncomingShare[]>("/shares/incoming", { token });
}

export function fetchFileShares(token: string, fileId: string) {
  return apiJson<FileAccessRow[]>(`/shares/file/${fileId}`, { token });
}

export function revokeShare(token: string, shareId: string) {
  return apiJson<{ deleted: boolean }>(`/shares/${shareId}`, {
    method: "DELETE",
    token,
  });
}

export async function shareFileWithContact(
  token: string,
  unlocked: UnlockedVault,
  fileId: string,
  contact: ContactRow,
) {
  if (!contact.contactUserId) {
    throw new Error(
      "That contact is not a VaultSpace user. Add them by their account email.",
    );
  }

  const meta = await apiJson<{
    wrappedAesKey: string;
  }>(`/files/${fileId}`, { token });

  if (!meta.wrappedAesKey) {
    throw new Error("Could not load file key material");
  }

  const recipientPublicKey = await importPublicKeyPem(contact.publicKeyPem);
  const wrappedAesKey = await rewrapAesKeyForRecipient(
    meta.wrappedAesKey,
    unlocked.privateKey,
    recipientPublicKey,
  );

  return apiJson<OutgoingShare>("/shares", {
    method: "POST",
    token,
    body: JSON.stringify({
      fileId,
      contactId: contact.id,
      wrappedAesKey,
      permission: "download",
    }),
  });
}

export async function downloadSharedFile(
  token: string,
  unlocked: UnlockedVault,
  share: IncomingShare,
) {
  const meta = await apiJson<{
    originalName: string;
    mimeType: string;
    wrappedAesKey: string;
    iv: string;
    authTag: string;
  }>(`/shares/${share.id}`, { token });

  const ciphertext = await apiBinary(`/shares/${share.id}/content`, token);
  const blob = await decryptFile(
    ciphertext,
    {
      wrappedAesKey: meta.wrappedAesKey,
      iv: meta.iv,
      authTag: meta.authTag,
      mimeType: meta.mimeType || share.mimeType,
    },
    unlocked.privateKey,
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = meta.originalName || share.originalName;
  a.click();
  URL.revokeObjectURL(url);
}
