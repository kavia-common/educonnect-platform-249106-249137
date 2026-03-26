"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Assignments", href: "/assignments", icon: <NotebookPen className="h-4 w-4" /> },
  { label: "Grades", href: "/grades", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Calendar", href: "/calendar", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Profile", href: "/profile", icon: <User className="h-4 w-4" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          <span className="text-gray-500">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <Container className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">
                  EduConnect
                </div>
                <div className="text-xs text-gray-500">
                  Student & educator portal
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {right}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm sm:flex">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                <User className="h-4 w-4" />
              </span>
              <span className="text-sm text-gray-700">Account</span>
            </div>
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-6 py-6 md:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden h-fit rounded-xl border border-gray-200 bg-white shadow-sm md:block">
          <div className="border-b border-gray-100 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Navigation
            </div>
          </div>
          <SidebarNav />
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </main>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    EduConnect
                  </div>
                  <div className="text-xs text-gray-500">Menu</div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
