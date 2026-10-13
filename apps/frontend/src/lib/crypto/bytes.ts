/** Fresh ArrayBuffer-backed view — satisfies DOM BufferSource typing. */
export function asBufferSource(data: ArrayBuffer | Uint8Array): Uint8Array<ArrayBuffer> {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy;
}

export function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = asBufferSource(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export function base64ToBuf(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function concatBytes(
  ...parts: Uint8Array[]
): Uint8Array<ArrayBuffer> {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", asBufferSource(data));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
