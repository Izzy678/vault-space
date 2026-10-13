"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiJson } from "../api/client";
import { clearVaultSession } from "../crypto/vaultSession";

type User = { id: string; email: string; name: string | null };

type LoginResult =
  | { requires2fa: false }
  | { requires2fa: true; preAuthToken: string; email: string };

type AuthState = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  completeLogin2fa: (preAuthToken: string, code: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "vaultspace.auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: User };
        setToken(parsed.token);
        setUser({
          ...parsed.user,
          name: parsed.user.name ?? null,
        });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    );
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const res = await apiJson<{
        requires2fa?: boolean;
        preAuthToken?: string;
        accessToken?: string;
        user: User;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.requires2fa && res.preAuthToken) {
        return {
          requires2fa: true,
          preAuthToken: res.preAuthToken,
          email: res.user.email,
        };
      }

      if (!res.accessToken) {
        throw new Error("Login failed");
      }
      persist(res.accessToken, res.user);
      return { requires2fa: false };
    },
    [persist],
  );

  const completeLogin2fa = useCallback(
    async (preAuthToken: string, code: string) => {
      const res = await apiJson<{ accessToken: string; user: User }>(
        "/auth/2fa/login",
        {
          method: "POST",
          body: JSON.stringify({ preAuthToken, code }),
        },
      );
      persist(res.accessToken, res.user);
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiJson<{ accessToken: string; user: User }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        },
      );
      persist(res.accessToken, res.user);
    },
    [persist],
  );

  const updateName = useCallback(
    async (name: string) => {
      if (!token) throw new Error("Not signed in");
      const res = await apiJson<{ user: User }>("/auth/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ name }),
      });
      persist(token, res.user);
    },
    [persist, token],
  );

  const logout = useCallback(() => {
    clearVaultSession();
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      completeLogin2fa,
      register,
      updateName,
      logout,
    }),
    [
      user,
      token,
      ready,
      login,
      completeLogin2fa,
      register,
      updateName,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
