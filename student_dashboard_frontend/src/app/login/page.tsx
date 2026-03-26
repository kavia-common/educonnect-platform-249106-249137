"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { getApiBaseUrl, login } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  // Basic email sanity check (backend also validates)
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!ok) return "Enter a valid email address.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 3) return "Password must be at least 3 characters.";
  return null;
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [email, setEmail] = React.useState("student1@educonnect.test");
  const [password, setPassword] = React.useState("dev");
  const [showPassword, setShowPassword] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // If already authenticated, don't show login form.
    if (isAuthenticated()) {
      router.replace(next);
    }
  }, [router, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setError(emailErr ?? passErr);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-900">
                EduConnect
              </div>
              <div className="text-xs text-gray-600">
                Sign in to your dashboard
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Login</CardTitle>
                <div className="mt-1 text-xs text-gray-600">
                  Backend:{" "}
                  <span className="font-medium">{getApiBaseUrl()}</span>
                </div>
              </div>
              <Badge variant="info">DEV</Badge>
            </CardHeader>

            <CardBody>
              {error ? (
                <div
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <div className="text-xs font-medium text-gray-700">
                    Email
                  </div>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-400"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-medium text-gray-700">
                      Password
                    </div>
                    <button
                      type="button"
                      className="text-xs text-gray-600 hover:text-gray-900"
                      onClick={() => setShowPassword((s) => !s)}
                      disabled={submitting}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-400"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    DEV mode: password is ignored by the backend.
                  </div>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>

                <div className="text-xs text-gray-600">
                  Tip: try{" "}
                  <span className="font-medium">student1@educonnect.test</span>{" "}
                  or{" "}
                  <span className="font-medium">teacher1@educonnect.test</span>.
                </div>

                <div className="pt-2 text-xs text-gray-600">
                  <Link className="text-blue-700 hover:underline" href="/">
                    Back to home
                  </Link>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </Container>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <main className="min-h-screen bg-gray-50">
          <Container className="flex min-h-screen items-center justify-center py-10">
            <div className="text-sm text-gray-600">Loading…</div>
          </Container>
        </main>
      }
    >
      <LoginInner />
    </React.Suspense>
  );
}
