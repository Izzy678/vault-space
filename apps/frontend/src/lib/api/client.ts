const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseError(res: Response): Promise<never> {
  let message = res.statusText;
  try {
    const data = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) message = data.message.join(", ");
    else if (data.message) message = data.message;
  } catch {
    /* ignore */
  }
  throw new ApiError(message, res.status);
}

export async function apiJson<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
      ...headers,
    },
  });
  if (!res.ok) await parseError(res);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiUpload<T>(
  path: string,
  form: FormData,
  token: string,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<T>;
}

export async function apiBinary(
  path: string,
  token: string,
): Promise<ArrayBuffer> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) await parseError(res);
  return res.arrayBuffer();
}

export { API_URL };
