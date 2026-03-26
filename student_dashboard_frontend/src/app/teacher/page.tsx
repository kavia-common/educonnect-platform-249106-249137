"use client";

import * as React from "react";
import { BookOpen, Megaphone, NotebookPen, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { Badge, Card, CardBody, CardHeader, CardTitle } from "@/components/ui";
import { Modal } from "@/components/Modal";
import type { AnnouncementSummary, AssignmentSummary, CourseSummary, ID } from "@/lib/types";
import {
  managementCreateAnnouncement,
  managementCreateAssignment,
  managementCreateCourse,
  managementDeleteAnnouncement,
  managementDeleteAssignment,
  managementDeleteCourse,
  managementListAnnouncements,
  managementListAssignments,
  managementListCourses,
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

export default function TeacherHomePage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [courses, setCourses] = React.useState<CourseSummary[]>([]);
  const [assignments, setAssignments] = React.useState<AssignmentSummary[]>([]);
  const [announcements, setAnnouncements] = React.useState<AnnouncementSummary[]>([]);

  const [createCourseOpen, setCreateCourseOpen] = React.useState(false);
  const [createAssignmentOpen, setCreateAssignmentOpen] = React.useState(false);
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = React.useState(false);

  const [courseForm, setCourseForm] = React.useState({ code: "", title: "", description: "" });
  const [assignmentForm, setAssignmentForm] = React.useState<{ courseId: ID; title: string; description: string; dueAt: string }>(
    { courseId: "", title: "", description: "", dueAt: "" },
  );
  const [announcementForm, setAnnouncementForm] = React.useState<{ courseId: ID | ""; title: string; body: string }>(
    { courseId: "", title: "", body: "" },
  );

  async function refreshAll() {
    setError(null);
    setLoading(true);
    try {
      const [c, a, ann] = await Promise.all([
        managementListCourses(),
        managementListAssignments({ status: "all" }),
        managementListAnnouncements({ limit: 50 }),
      ]);
      setCourses(c);
      setAssignments(a);
      setAnnouncements(ann);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load teacher data.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void refreshAll();
  }, []);

  const courseOptions = courses;

  return (
    <RoleGate allow={["teacher", "admin"]}>
      <DashboardShell
        title="Teacher"
        subtitle="Manage courses, assignments, and announcements."
        right={<Badge variant="info">Teacher</Badge>}
      >
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <CardTitle>Courses</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{courses.length}</Badge>
                <button
                  type="button"
                  onClick={() => {
                    setCourseForm({ code: "", title: "", description: "" });
                    setCreateCourseOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  New
                </button>
              </div>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : courses.length === 0 ? (
                <div className="text-sm text-gray-600">No courses yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {courses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-500">{c.code}</div>
                        <div className="truncate text-sm font-semibold text-gray-900">{c.title}</div>
                        <div className="mt-0.5 text-xs text-gray-600">{c.instructorName}</div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Delete this course?")) return;
                          await managementDeleteCourse(c.id);
                          await refreshAll();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-blue-600" />
                <CardTitle>Assignments</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAssignmentForm({ courseId: courseOptions[0]?.id ?? "", title: "", description: "", dueAt: "" });
                  setCreateAssignmentOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : assignments.length === 0 ? (
                <div className="text-sm text-gray-600">No assignments.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {assignments.slice(0, 10).map((a) => (
                    <div key={a.id} className="py-3">
                      <div className="text-sm font-medium text-gray-900">{a.title}</div>
                      <div className="mt-0.5 text-xs text-gray-600">
                        Course: {courses.find((c) => c.id === a.courseId)?.code ?? a.courseId}
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm("Delete this assignment?")) return;
                            await managementDeleteAssignment(a.id);
                            await refreshAll();
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Announcements */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-blue-600" />
                <CardTitle>Announcements</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnnouncementForm({ courseId: courseOptions[0]?.id ?? "", title: "", body: "" });
                  setCreateAnnouncementOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : announcements.length === 0 ? (
                <div className="text-sm text-gray-600">No announcements.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {announcements.slice(0, 12).map((ann) => (
                    <article key={ann.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900">{ann.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-gray-600">{ann.body}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {ann.authorName} •{" "}
                          {courses.find((c) => c.id === ann.courseId)?.code ?? (ann.courseId ? ann.courseId : "Global")}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Delete this announcement?")) return;
                          await managementDeleteAnnouncement(ann.id);
                          await refreshAll();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Create course modal */}
        <Modal
          open={createCourseOpen}
          title="Create course"
          description="Create a new course you manage."
          onClose={() => setCreateCourseOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCreateCourseOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={async () => {
                  await managementCreateCourse({
                    code: courseForm.code,
                    title: courseForm.title,
                    description: courseForm.description || undefined,
                  });
                  setCreateCourseOpen(false);
                  await refreshAll();
                }}
                disabled={!courseForm.code.trim() || !courseForm.title.trim()}
              >
                Create
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel>Code</FieldLabel>
              <TextInput
                value={courseForm.code}
                onChange={(e) => setCourseForm((s) => ({ ...s, code: e.target.value }))}
                placeholder="MATH101"
              />
            </div>
            <div>
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={courseForm.title}
                onChange={(e) => setCourseForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="Calculus I"
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <TextArea
                rows={4}
                value={courseForm.description}
                onChange={(e) => setCourseForm((s) => ({ ...s, description: e.target.value }))}
                placeholder="Optional course description…"
              />
            </div>
          </div>
        </Modal>

        {/* Create assignment modal */}
        <Modal
          open={createAssignmentOpen}
          title="Create assignment"
          description="Create a new assignment for one of your courses."
          onClose={() => setCreateAssignmentOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCreateAssignmentOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={async () => {
                  await managementCreateAssignment({
                    courseId: assignmentForm.courseId,
                    title: assignmentForm.title,
                    description: assignmentForm.description || null,
                    dueAt: assignmentForm.dueAt || null,
                  });
                  setCreateAssignmentOpen(false);
                  await refreshAll();
                }}
                disabled={!assignmentForm.courseId || !assignmentForm.title.trim()}
              >
                Create
              </button>
            </>
          }
        >
          {courseOptions.length === 0 ? (
            <div className="text-sm text-gray-700">
              Create a course first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <FieldLabel>Course</FieldLabel>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  value={assignmentForm.courseId}
                  onChange={(e) => setAssignmentForm((s) => ({ ...s, courseId: e.target.value }))}
                >
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Homework 1"
                />
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <TextArea
                  rows={4}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Optional instructions…"
                />
              </div>
              <div>
                <FieldLabel>Due at (ISO)</FieldLabel>
                <TextInput
                  value={assignmentForm.dueAt}
                  onChange={(e) => setAssignmentForm((s) => ({ ...s, dueAt: e.target.value }))}
                  placeholder="2026-03-26T23:59:00Z"
                />
              </div>
            </div>
          )}
        </Modal>

        {/* Create announcement modal */}
        <Modal
          open={createAnnouncementOpen}
          title="Create announcement"
          description="Post an announcement to a course you manage."
          onClose={() => setCreateAnnouncementOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCreateAnnouncementOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={async () => {
                  await managementCreateAnnouncement({
                    courseId: announcementForm.courseId || null,
                    title: announcementForm.title,
                    body: announcementForm.body,
                  });
                  setCreateAnnouncementOpen(false);
                  await refreshAll();
                }}
                disabled={!announcementForm.courseId || !announcementForm.title.trim() || !announcementForm.body.trim()}
              >
                Post
              </button>
            </>
          }
        >
          {courseOptions.length === 0 ? (
            <div className="text-sm text-gray-700">
              Create a course first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <FieldLabel>Course</FieldLabel>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  value={announcementForm.courseId}
                  onChange={(e) => setAnnouncementForm((s) => ({ ...s, courseId: e.target.value }))}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Exam schedule update"
                />
              </div>
              <div>
                <FieldLabel>Body</FieldLabel>
                <TextArea
                  rows={5}
                  value={announcementForm.body}
                  onChange={(e) => setAnnouncementForm((s) => ({ ...s, body: e.target.value }))}
                  placeholder="Write your announcement…"
                />
              </div>
            </div>
          )}
        </Modal>
      </DashboardShell>
    </RoleGate>
  );
}
