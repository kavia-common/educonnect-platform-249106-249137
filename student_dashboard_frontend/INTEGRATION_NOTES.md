# EduConnect Integration Notes (Frontend → Backend/DB)

## What the frontend dashboard expects
The dashboard UI is wired to load a single aggregated payload:

- `GET /api/students/me/dashboard` → `DashboardResponse`

This response aggregates:
- student profile summary (`id`, `fullName`, `role`)
- enrolled courses
- upcoming assignments
- grade summaries (percent per course)
- recent announcements

Until the backend is implemented, the frontend falls back to mock data (see `src/lib/api.ts`).

## Backend status (as of current OpenAPI)
The backend OpenAPI currently only exposes:
- `GET /` (health check)

No `/api/*` routes exist yet, so full integration is blocked.

## Required backend endpoints (minimum for dashboard)
Suggested FastAPI endpoints:

### Dashboard aggregate
- `GET /api/students/me/dashboard`
  - Returns the `DashboardResponse` shape used by `src/lib/types.ts`

### Authentication (needed soon)
Because `next.config.ts` uses `output: "export"` (static export), prefer:
- Token-based auth stored in memory/localStorage (not ideal), OR
- Host the frontend with a server runtime (remove static export) to support secure cookies.

Endpoints:
- `POST /api/auth/login`  (email/password) → sets auth (token or cookie)
- `POST /api/auth/logout`
- `GET /api/auth/me` → current user

### Supporting list endpoints (next pages)
- `GET /api/courses` (enrolled or all based on role)
- `GET /api/assignments?status=upcoming|all`
- `GET /api/grades`
- `GET /api/announcements`

## Required database schema (minimum)
Tables (minimum viable):
- `users` (id, email, password_hash, role, created_at)
- `students` (id, user_id, full_name, ...)
- `courses` (id, code, title, instructor_user_id, meeting_times, ...)
- `enrollments` (student_id, course_id)
- `assignments` (id, course_id, title, due_at, description, ...)
- `submissions` (id, assignment_id, student_id, status, submitted_at)
- `grades` (id, course_id, student_id, percent, updated_at)
- `announcements` (id, course_id nullable, title, body, author_user_id, published_at)

## Env vars needed (frontend)
Build-time:
- `NEXT_PUBLIC_BACKEND_URL` (base URL of FastAPI, e.g. `https://...:3001`)

## Notes on static export constraint
With `output: "export"`, Next.js App Router pages are pre-rendered and there are limitations:
- No server components fetching private data at request time
- Cookie-based auth patterns are constrained

Current implementation uses client-side fetch + mock fallback to remain functional.
