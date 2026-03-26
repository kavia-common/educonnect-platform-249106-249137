"use client";

import * as React from "react";
import Link from "next/link";
import { Megaphone, Shield, Users } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { Badge, Card, CardBody, CardHeader, CardTitle } from "@/components/ui";
import { Modal } from "@/components/Modal";
import type { AnnouncementSummary } from "@/lib/types";
import {
  managementCreateAnnouncement,
  managementDeleteAnnouncement,
  managementListAnnouncements,
} from "@/lib/managementApi";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{children}</div>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default function AdminHomePage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [announcements, setAnnouncements] = React.useState<AnnouncementSummary[]>([]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", body: "" });

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const ann = await managementListAnnouncements({ limit: 50 });
      setAnnouncements(ann);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void refresh();
  }, []);

  const globalAnnouncements = announcements.filter((a) => !a.courseId);

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        title="Admin"
        subtitle="Administrative controls. Manage global announcements and access teacher management for courses."
        right={<Badge variant="warning">Admin</Badge>}
      >
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <CardTitle>Management areas</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-700">
                Admins can manage all courses/assignments/announcements from the Teacher area.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  href="/teacher"
                >
                  Open course management
                </Link>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <CardTitle>System</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-600">
                User/role management is not implemented in this iteration.
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-blue-600" />
                <CardTitle>Global announcements</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", body: "" });
                  setCreateOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Create
              </button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : globalAnnouncements.length === 0 ? (
                <div className="text-sm text-gray-600">No global announcements.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {globalAnnouncements.map((ann) => (
                    <article key={ann.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900">{ann.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-gray-600">{ann.body}</div>
                        <div className="mt-1 text-xs text-gray-500">{ann.authorName}</div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Delete this global announcement?")) return;
                          await managementDeleteAnnouncement(ann.id);
                          await refresh();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Modal
          open={createOpen}
          title="Create global announcement"
          description="Visible to all users (courseId = null)."
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={async () => {
                  await managementCreateAnnouncement({
                    courseId: null,
                    title: form.title,
                    body: form.body,
                  });
                  setCreateOpen(false);
                  await refresh();
                }}
                disabled={!form.title.trim() || !form.body.trim()}
              >
                Publish
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="Maintenance window"
              />
            </div>
            <div>
              <FieldLabel>Body</FieldLabel>
              <TextArea
                rows={5}
                value={form.body}
                onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
                placeholder="Write the announcement…"
              />
            </div>
          </div>
        </Modal>
      </DashboardShell>
    </RoleGate>
  );
}
