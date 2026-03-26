"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import type { UserRole } from "@/lib/types";

function canAccessPath(role: UserRole, path: string): boolean {
  // Normalize (no query here, pathname only)
  const p = path || "/";

  // Public
  if (p.startsWith("/login")) return true;

  // Shared authenticated routes (future-proof)
  if (p === "/") return true;

  // Role-specific namespaces
  if (p.startsWith("/teacher")) return role === "teacher" || role === "admin";
  if (p.startsWith("/admin")) return role === "admin";

  // Default: allow (so we don't accidentally block future general pages)
  return true;
}

// PUBLIC_INTERFACE
export function RoleGate({
  allow,
  children,
}: {
  allow?: UserRole[]; // optional explicit allowlist for a page
  children: React.ReactNode;
}) {
  /**
   * Client-side gate for static-export builds.
   * - If not authenticated: redirect to /login?next=<path>
   * - If authenticated but role not allowed: redirect to /
   */
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();

  React.useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const next = pathname || "/";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!user) return;

    const explicitDenied = allow && allow.length > 0 && !allow.includes(user.role);
    const implicitDenied = !canAccessPath(user.role, pathname || "/");

    if (explicitDenied || implicitDenied) {
      router.replace("/");
    }
  }, [status, user, allow, router, pathname]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-10 text-sm text-gray-600">Loading…</Container>
      </main>
    );
  }

  if (status === "unauthenticated") {
    // Avoid flashing protected content before redirect.
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-10 text-sm text-gray-600">
          Redirecting to login…
        </Container>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-10 text-sm text-gray-600">Loading…</Container>
      </main>
    );
  }

  // If role denied, we already triggered redirect; keep UI blank-ish.
  const explicitDenied = allow && allow.length > 0 && !allow.includes(user.role);
  const implicitDenied = !canAccessPath(user.role, pathname || "/");
  if (explicitDenied || implicitDenied) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-10 text-sm text-gray-600">
          Redirecting…
        </Container>
      </main>
    );
  }

  return <>{children}</>;
}
