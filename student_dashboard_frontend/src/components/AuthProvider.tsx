"use client";

import * as React from "react";
import { fetchMe, logout } from "@/lib/api";
import { hasAuthToken } from "@/lib/api";
import type { UserRole } from "@/lib/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthUser = {
  email: string;
  fullName: string;
  role: UserRole;
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function safeFetchMe(): Promise<AuthUser> {
  const me = await fetchMe();
  // Runtime safety: accept backend string but coerce to known roles.
  const role = me.role === "admin" || me.role === "teacher" ? me.role : "student";
  return { email: me.email, fullName: me.fullName, role };
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * Provides app-wide authentication state for a static-export Next.js app.
   * Loads the current user using GET /api/auth/me when a token exists.
   */
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setError(null);

    // No token -> unauthenticated (avoid calling backend).
    if (!hasAuthToken()) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");
    try {
      const me = await safeFetchMe();
      setUser(me);
      setStatus("authenticated");
    } catch (e) {
      // Token may be invalid/expired; clear it and treat as logged out.
      await logout();
      setUser(null);
      setStatus("unauthenticated");
      setError(e instanceof Error ? e.message : "Failed to load user profile.");
    }
  }, []);

  const signOut = React.useCallback(async () => {
    await logout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const value: AuthContextValue = React.useMemo(
    () => ({ status, user, error, refresh, signOut }),
    [status, user, error, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /** Hook to access the current auth status and user role. */
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}
