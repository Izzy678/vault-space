import { apiJson } from "./api/client";

export type TwofaStatus = { enabled: boolean };

export type TwofaSetup = {
  secret: string;
  otpauthUrl: string;
  qrDataUrl: string;
};

export function fetchTwofaStatus(token: string) {
  return apiJson<TwofaStatus>("/auth/2fa", { token });
}

export function beginTwofaSetup(token: string) {
  return apiJson<TwofaSetup>("/auth/2fa/setup", {
    method: "POST",
    token,
    body: "{}",
  });
}

export function enableTwofa(token: string, code: string) {
  return apiJson<{ enabled: boolean; recoveryCodes: string[] }>(
    "/auth/2fa/enable",
    {
      method: "POST",
      token,
      body: JSON.stringify({ code }),
    },
  );
}

export function disableTwofa(token: string, code: string) {
  return apiJson<{ enabled: boolean }>("/auth/2fa/disable", {
    method: "POST",
    token,
    body: JSON.stringify({ code }),
  });
}
