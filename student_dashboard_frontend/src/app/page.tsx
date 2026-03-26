"use client";

import * as React from "react";
import { BookOpen, CalendarDays, Megaphone, NotebookPen } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Card, CardBody, CardHeader, CardTitle, ProgressBar } from "@/components/ui";
import { fetchDashboard, getApiBaseUrl } from "@/lib/api";
import type {
  AnnouncementSummary,
  AssignmentSummary,
  CourseSummary,
  GradeSummary,
} from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

function AssignmentRow({ a, courses }: { a: AssignmentSummary; courses: CourseSummary[] }) {
  const course = courses.find((c) => c.id === a.courseId);
  const badgeVariant =
    a.status === "graded" ? "success" : a.status === "submitted" ? "info" : "warning";

  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-gray-900">{a.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
            Due {formatDate(a.dueAt)}
          </span>
          {course ? (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              {course.code}
            </span>
          ) : null}
        </div>
      </div>
      <Badge variant={badgeVariant}>{a.status}</Badge>
    </div>
  );
}

function AnnouncementRow({ ann }: { ann: AnnouncementSummary }) {
  return (
    <article className="py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-gray-900">
            {ann.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ann.body}</p>
          <div className="mt-1 text-xs text-gray-500">
            {ann.authorName} • {formatDate(ann.publishedAt)}
          </div>
        </div>
      </div>
    </article>
  );
}

function GradeRow({ g }: { g: GradeSummary }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-900">
            {g.courseCode}
          </div>
          <div className="truncate text-xs text-gray-600">{g.courseTitle}</div>
        </div>
        <div className="text-sm font-semibold text-gray-900">{g.currentPercent}%</div>
      </div>
      <div className="mt-2">
        <ProgressBar value={g.currentPercent} label={`${g.currentPercent}%`} />
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [studentName, setStudentName] = React.useState<string>("");
  const [courses, setCourses] = React.useState<CourseSummary[]>([]);
  const [upcoming, setUpcoming] = React.useState<AssignmentSummary[]>([]);
  const [grades, setGrades] = React.useState<GradeSummary[]>([]);
  const [announcements, setAnnouncements] = React.useState<AnnouncementSummary[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboard();
        if (!mounted) return;
        setStudentName(data.student.fullName);
        setCourses(data.courses);
        setUpcoming(data.upcomingAssignments);
        setGrades(data.grades);
        setAnnouncements(data.announcements);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={
        studentName
          ? `Welcome back, ${studentName}. Here’s what’s coming up this week.`
          : "Your overview for courses, assignments, grades, and announcements."
      }
      right={
        <div className="hidden items-center gap-2 text-xs text-gray-500 lg:flex">
          <span className="rounded-full bg-gray-100 px-2 py-1">
            API: {getApiBaseUrl()}
          </span>
        </div>
      }
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
              <CardTitle>Your courses</CardTitle>
            </div>
            <Badge variant="neutral">{courses.length}</Badge>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-sm text-gray-600">Loading courses…</div>
            ) : courses.length === 0 ? (
              <div className="text-sm text-gray-600">No courses yet.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-500">
                          {c.code}
                        </div>
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {c.title}
                        </div>
                        <div className="mt-1 truncate text-xs text-gray-600">
                          {c.instructorName}
                        </div>
                      </div>
                      {c.meetingTimes ? (
                        <Badge variant="info" className="shrink-0">
                          {c.meetingTimes}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-blue-600" />
              <CardTitle>Upcoming</CardTitle>
            </div>
            <Badge variant="neutral">{upcoming.length}</Badge>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-sm text-gray-600">Loading assignments…</div>
            ) : upcoming.length === 0 ? (
              <div className="text-sm text-gray-600">No upcoming work.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcoming.slice(0, 6).map((a) => (
                  <AssignmentRow key={a.id} a={a} courses={courses} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Grades */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                %
              </span>
              <CardTitle>Grades</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-sm text-gray-600">Loading grades…</div>
            ) : grades.length === 0 ? (
              <div className="text-sm text-gray-600">No grades posted.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {grades.map((g) => (
                  <GradeRow key={g.courseId} g={g} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-blue-600" />
              <CardTitle>Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-sm text-gray-600">Loading announcements…</div>
            ) : announcements.length === 0 ? (
              <div className="text-sm text-gray-600">No announcements.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {announcements.slice(0, 6).map((ann) => (
                  <AnnouncementRow key={ann.id} ann={ann} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
