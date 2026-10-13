import { apiJson } from "./api/client";

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  publicKeyPem: string;
  fingerprint: string;
  verified: boolean;
  hue: number;
  contactUserId: string | null;
  createdAt: string;
};

export function fetchContacts(token: string) {
  return apiJson<ContactRow[]>("/contacts", { token });
}

export function addContact(
  token: string,
  body: {
    email: string;
    name?: string;
    publicKeyPem?: string;
    fingerprint?: string;
  },
) {
  return apiJson<ContactRow>("/contacts", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function verifyContact(token: string, id: string, verified: boolean) {
  return apiJson<ContactRow>(`/contacts/${id}/verify`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ verified }),
  });
}

export function deleteContact(token: string, id: string) {
  return apiJson<{ deleted: boolean }>(`/contacts/${id}`, {
    method: "DELETE",
    token,
  });
}

export function contactInitials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
