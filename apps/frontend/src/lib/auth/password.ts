import { apiJson } from "@/lib/api/client";

export function changeAccountPassword(
  token: string,
  body: {
    currentPassword: string;
    newPassword: string;
    code?: string;
  },
) {
  return apiJson<{ changed: boolean }>("/auth/password", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}
