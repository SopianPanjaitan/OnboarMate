# Phase 2A Implementation Plan — OnboardMate

## Overview

**Goal:** Establish the security foundation that all subsequent phases depend on:
environment configuration, full database schema with RLS, authentication flows,
invitation-only registration, and middleware route protection.

**Scope:** Everything in this plan is purely server-side infrastructure and
authentication. No Phase 1 UI files are modified. No AI, storage, or onboarding
logic is implemented. Phase 2B (real dashboard data, HR invite UI wire-up) begins
only after this plan's acceptance criteria pass.

**Confirmed decisions:**
1. Keep `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as the env var name throughout.
2. Supabase URL must be the base project URL with no path suffix.
3. Platform Super Admin stored in a separate `platform_admins` table — not in
   `organization_members`.
4. Mentor scope enforced via a dedicated `mentor_assignments` table.
5. Department FK on `organization_members` and `invitations` uses a composite
   `(organization_id, department_id)` reference to `departments(organization_id, id)`.

**Canonical table count: 18**
16 from DATABASE_SCHEMA.md + `platform_admins` (decision 3) +
`mentor_assignments` (decision 4).

**Phase 2A does NOT include:**
- `onboarding_templates`, `template_tasks`, `onboarding_assignments`,
  `assignment_tasks`, `task_progress` (Phase 3)
- `knowledge_documents`, `document_access_roles`, `document_chunks` (Phase 4/5)
- `conversations`, `messages` (Phase 6)
- Storage buckets (Phase 4)
- Real AI integration (Phase 6)

---

## Sub-Task 1 — Fix environment configuration and add `.env.example`

**Status:** `[ ] pending`

### Intent
The `.env.local` file has two blockers identified in the audit:
- `NEXT_PUBLIC_SUPABASE_URL` contains `/rest/v1/` suffix — must be the bare
  project base URL.
- No `.env.example` file exists, violating the AGENTS.md security rule.

The three Supabase client files already use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
consistently — keep that name.

### Expected Outcomes
- `.env.local` has `NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co`
  (no path suffix).
- `.env.example` committed to git with placeholder values.
- `SUPABASE_SERVICE_ROLE_KEY` placeholder present in `.env.example` (not in
  `.env.local` until the service-role client sub-task).
- Existing three Supabase client files are unchanged.

### Todo List
1. Correct `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` to strip `/rest/v1/`.
2. Create `.env.example` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   ```
3. Verify `.gitignore` already excludes `.env.*` and preserves `.env.example`
   (confirmed — no change needed).

### Relevant Context
- `.env.local` — two env vars, URL has path suffix
- `src/lib/supabase/client.ts`, `server.ts`, `update-session.ts` — all reference
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; do not rename
- `.gitignore` line 16–17: `.env.*` excluded, `!.env.example` preserved

### Acceptance Criteria
- `npm run build` still passes after this change.
- `.env.example` is present and tracked by git.
- No secrets appear in `.env.example`.

---

## Sub-Task 2 — Add service-role Supabase client (server-only)

**Status:** `[ ] pending`

### Intent
Admin operations (provisioning, invitation send, auth callback) require the
Supabase service-role key, which bypasses RLS. This client must live in a
server-only module — never importable from client components.

### Expected Outcomes
- `src/lib/supabase/service-role.ts` exports `createServiceRoleClient()`.
- The function reads `SUPABASE_SERVICE_ROLE_KEY` from `process.env`.
- File has no `"use client"` directive and is never re-exported via a barrel
  that client components can import.
- A separate `src/lib/supabase/admin.ts` wraps the service-role client and
  exports `inviteUserByEmail(email, metadata)` and `createUser(attrs)` — the
  only two admin auth operations needed in Phase 2A.

### Expected file structure
```
src/lib/supabase/
  client.ts           ← browser client (unchanged)
  server.ts           ← server component client (unchanged)
  update-session.ts   ← middleware session refresh (unchanged)
  service-role.ts     ← NEW: service-role client factory
  admin.ts            ← NEW: auth admin operations wrapper
```

### Todo List
1. Create `src/lib/supabase/service-role.ts`:
   - Import `createClient` from `@supabase/supabase-js`.
   - Read `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   - Throw on missing vars.
   - Return `createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })`.
2. Create `src/lib/supabase/admin.ts`:
   - Import `createServiceRoleClient` from `./service-role`.
   - Export `inviteUserByEmail(email: string, metadata: Record<string, unknown>)`.
   - Export `getUserByEmail(email: string)`.
   - Both functions call the service-role client's `auth.admin.*` methods.
3. Add a TypeScript type guard: if `typeof window !== 'undefined'` throw — making
   accidental client-side import a runtime error during development.

### Relevant Context
- `@supabase/supabase-js` is already in `package.json` dependencies.
- `SUPABASE_SERVICE_ROLE_KEY` is not yet in `.env.local` — added as a placeholder
  in `.env.example` (Sub-Task 1); real value added to `.env.local` manually.

### Acceptance Criteria
- `npm run build` passes.
- `npm run lint` passes.
- TypeScript strict mode: no `any` types, no unsafe casts.
- Neither `service-role.ts` nor `admin.ts` is imported by any file under
  `src/app/` that could be a client component (verified by grep after creation).

---

## Sub-Task 3 — Initialize Supabase CLI and migration structure

**Status:** `[ ] pending`

### Intent
No `supabase/` directory exists. The CLI must be initialized so migrations can
be applied locally and to the remote project.

### Expected Outcomes
- `supabase/` directory exists with `config.toml`, `migrations/`, `seed/`.
- CLI is linked to the remote project.
- Migration files use timestamped naming: `YYYYMMDDHHMMSS_<slug>.sql`.

### Todo List
1. Run `npx supabase init` at workspace root (creates `supabase/config.toml`).
2. Run `npx supabase link --project-ref <ref>` to link to the remote project.
3. Confirm `supabase/migrations/` and `supabase/seed/` directories exist.
4. Add `supabase/.branches` to `.gitignore` if created.

### Relevant Context
- Remote project ref is embedded in `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
- `package.json` has no `supabase` CLI listed — install as a dev dependency or
  use `npx supabase` directly.

### Acceptance Criteria
- `supabase/config.toml` exists.
- `npx supabase status` returns project connection details without error.
- No migration has been applied yet (this sub-task is structure-only).

---

## Sub-Task 4 — Migration 001: Foundation tables

**Status:** `[ ] pending`

### Intent
Create the identity and access tables that every other table depends on.
These 7 tables form the Phase 2A schema foundation:
`organizations`, `profiles`, `platform_admins`, `departments`,
`organization_members`, `invitations`, `audit_logs`.

Note: `mentor_assignments` is deferred to Migration 002 because it references
`organization_members`, which is defined here.

### Table definitions and constraints

#### `organizations`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
name          TEXT NOT NULL
slug          TEXT NOT NULL UNIQUE
description   TEXT
status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','suspended','archived'))
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```

#### `profiles`
```sql
id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
full_name     TEXT
avatar_path   TEXT
job_title     TEXT
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```
Trigger: `handle_new_user()` — on `INSERT INTO auth.users` create a `profiles`
row. This is the standard Supabase pattern for profile sync.

#### `platform_admins`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```
No `organization_id`. Managed exclusively via service-role. RLS: no row is
selectable by any authenticated org-level user.

#### `departments`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
name            TEXT NOT NULL
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
UNIQUE (organization_id, name)
-- Composite unique backing downstream composite FK:
UNIQUE (organization_id, id)
```

#### `organization_members`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
department_id   UUID NULL
-- Composite FK: department must belong to same org
-- FOREIGN KEY (organization_id, department_id)
--   REFERENCES departments(organization_id, id)
role            TEXT NOT NULL CHECK (role IN ('hr_admin','employee','mentor'))
status          TEXT NOT NULL DEFAULT 'invited'
                CHECK (status IN ('invited','active','suspended'))
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
UNIQUE (organization_id, user_id)
```

#### `invitations`
```sql
id                        UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
email                     TEXT NOT NULL
role                      TEXT NOT NULL CHECK (role IN ('employee','mentor'))
department_id             UUID NULL
-- Composite FK: department must belong to same org
-- FOREIGN KEY (organization_id, department_id)
--   REFERENCES departments(organization_id, id)
invited_by                UUID NOT NULL REFERENCES profiles(id)
auth_invitation_reference TEXT NULL        -- opaque ref, NOT raw token
status                    TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','accepted','expired','revoked'))
expires_at                TIMESTAMPTZ NOT NULL
created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
```
Index on `(organization_id, lower(email))` for lookup.

#### `audit_logs`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NULL REFERENCES organizations(id) ON DELETE SET NULL
actor_user_id   UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL
action          TEXT NOT NULL
resource_type   TEXT
resource_id     UUID NULL
metadata        JSONB
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```
Append-only: INSERT allowed for authenticated users; no UPDATE/DELETE.

### Expected Outcomes
- Migration file `supabase/migrations/YYYYMMDDHHMMSS_001_foundation.sql` created.
- All 7 tables created with correct constraints.
- `handle_new_user` trigger and function defined.
- `updated_at` trigger function defined and applied to tables that carry it.

### Todo List
1. Write trigger function `set_updated_at()` using `NEW.updated_at = now()`.
2. Write function and trigger `handle_new_user()` on `auth.users`.
3. Write all 7 `CREATE TABLE` statements in dependency order.
4. Write composite FK constraints for `department_id` on `organization_members`
   and `invitations`.
5. Write all indexes listed in DATABASE_SCHEMA.md §4 that apply to these tables.
6. Enable RLS on all tables (RLS policies in Sub-Task 5).

### Relevant Context
- `docs/DATABASE_SCHEMA.md` §2 — column specs
- `docs/DATABASE_SCHEMA.md` §4 — index list
- Decision 5 confirms composite FK for `department_id`

### Acceptance Criteria
- `npx supabase db push` (or `npx supabase migration up`) applies without error.
- `psql` confirms all tables, constraints, and indexes exist.
- No orphaned cross-org records are possible given FK definitions.

---

## Sub-Task 5 — Migration 002: RLS policies for foundation tables

**Status:** `[ ] pending`

### Intent
Enable and define Row Level Security policies on all 7 foundation tables.
Policies must be written before any data is inserted — RLS-enabled tables with
no policies default to deny-all, which is the correct starting state.

### Policy definitions

#### `organizations`
- SELECT: `EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = id AND om.user_id = auth.uid() AND om.status = 'active')`
- INSERT/UPDATE/DELETE: service-role only (no policy = denied for anon/authenticated)

#### `profiles`
- SELECT: own row → `auth.uid() = id`; OR authenticated user is hr_admin in an org where this profile is a member (for HR employee views — Phase 2B)
- INSERT: `auth.uid() = id` (profile created by trigger; explicit insert for tests)
- UPDATE: `auth.uid() = id`

#### `platform_admins`
- No SELECT policy for any non-service-role role → deny-all to org users
- INSERT/UPDATE/DELETE: service-role only

#### `departments`
- SELECT: active member of same organization
- INSERT/UPDATE/DELETE: active `hr_admin` in same organization

#### `organization_members`
- SELECT: own row (`user_id = auth.uid()`) OR active `hr_admin` in same org
- INSERT: service-role only (members created by auth callback or admin)
- UPDATE: active `hr_admin` in same org (role/status changes)
- DELETE: service-role only

#### `invitations`
- SELECT: active `hr_admin` in same org
- INSERT: active `hr_admin` in same org
- UPDATE: active `hr_admin` in same org (revoke, expire)
- DELETE: service-role only

#### `audit_logs`
- SELECT: active `hr_admin` (same org rows only via `organization_id`); platform_admins see all (via service-role)
- INSERT: authenticated users (append-only; no UPDATE/DELETE policy)
- UPDATE/DELETE: no policy (deny-all)

### Helper function
Define a stable `get_my_org_role(org_id UUID) RETURNS TEXT` SQL function that
returns the calling user's role in `organization_members` for the given org, or
NULL if not a member. Used to keep policy expressions DRY.

Define `is_platform_admin() RETURNS BOOLEAN` that checks `EXISTS (SELECT 1 FROM platform_admins WHERE user_id = auth.uid())`.

### Expected Outcomes
- Migration file `supabase/migrations/YYYYMMDDHHMMSS_002_rls_foundation.sql`.
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for each table.
- All policies defined and named descriptively (e.g., `org_members_select_own`).
- Helper functions defined in a dedicated schema or `public` with `SECURITY DEFINER`.

### Todo List
1. Write helper functions `get_my_org_role` and `is_platform_admin`.
2. Write SELECT, INSERT, UPDATE, DELETE policies for each of the 7 tables.
3. Apply `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` on each table.
4. Add `REVOKE ALL ON TABLE platform_admins FROM authenticated, anon` to prevent
   any direct access outside service-role context.

### Relevant Context
- `docs/DATABASE_SCHEMA.md` §5 — RLS policy principles
- `docs/SECURITY_DESIGN.md` §3 — authorization boundaries
- `docs/SECURITY_DESIGN.md` §4 — tenant isolation rules

### Acceptance Criteria
- Unauthenticated `SELECT * FROM organizations` returns 0 rows.
- Authenticated employee cannot SELECT from `platform_admins`.
- HR admin in Org A cannot SELECT `organization_members` from Org B.
- `audit_logs` INSERT succeeds for authenticated user; UPDATE fails.

---

## Sub-Task 6 — Migration 003: `mentor_assignments` table and RLS

**Status:** `[ ] pending`

### Intent
The schema docs state mentor scope but define no join table. This migration adds
`mentor_assignments`, which RLS policies on onboarding tables (Phase 3) will
require.

### Table definition
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
mentor_user_id  UUID NOT NULL
employee_user_id UUID NOT NULL
-- Both users must be active members of the same org:
-- FOREIGN KEY (organization_id, mentor_user_id)
--   REFERENCES organization_members(organization_id, user_id) [need composite unique]
-- FOREIGN KEY (organization_id, employee_user_id)
--   REFERENCES organization_members(organization_id, user_id)
assigned_by     UUID NOT NULL REFERENCES profiles(id)
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
UNIQUE (organization_id, mentor_user_id, employee_user_id)
```

Note: The composite FK to `organization_members(organization_id, user_id)` is
already backed by the `UNIQUE (organization_id, user_id)` constraint defined in
Migration 001. Both FKs can be declared.

### RLS policies
- SELECT: own row (mentor sees their assignments) OR `hr_admin` in same org.
- INSERT: `hr_admin` in same org.
- UPDATE: `hr_admin` in same org.
- DELETE: `hr_admin` in same org.

### Expected Outcomes
- Migration file `supabase/migrations/YYYYMMDDHHMMSS_003_mentor_assignments.sql`.
- Table created with composite FK constraints.
- RLS enabled and policies defined.

### Todo List
1. Write `CREATE TABLE mentor_assignments` with all constraints.
2. Add composite FKs referencing `organization_members(organization_id, user_id)`.
3. Enable RLS and write policies.
4. Add index on `(organization_id, employee_user_id)` for lookup efficiency.

### Relevant Context
- `docs/DATABASE_SCHEMA.md` §5: "Mentor reads only explicitly assigned mentee records"
- `docs/SECURITY_DESIGN.md` §3: "Mentor: explicitly assigned mentees only"

### Acceptance Criteria
- A mentor cannot SELECT `mentor_assignments` rows for another mentor's mentees.
- HR admin can INSERT and SELECT all rows in their org.
- A `mentor_assignments` row referencing a `user_id` from a different org is
  rejected by the composite FK.

---

## Sub-Task 7 — Auth callback route and session activation

**Status:** `[ ] pending`

### Intent
The auth callback is the critical link between Supabase Auth and the application
membership model. It runs when a user follows an invitation link or magic link.
Without it, invited users cannot activate their membership.

### Flow (from SYSTEM_ARCHITECTURE.md §5 — Invitation flow)
1. User follows the invitation link → Supabase redirects to `/auth/callback?code=...`
2. Callback route exchanges `code` for a session using `supabase.auth.exchangeCodeForSession(code)`.
3. Route reads the new user's email from the session.
4. Route finds the matching `invitations` row (`status='pending'`, same email, same org, not expired).
5. Route uses the server client to `UPDATE invitations SET status='accepted'`.
6. Route uses the server client to `UPDATE organization_members SET status='active'` for the matching `(organization_id, user_id)` row.
7. Route writes an `audit_logs` row: `action='invitation_accepted'`.
8. Route redirects to `/app/dashboard` (employee/mentor) or `/hr/dashboard` (hr_admin).

### Expected Outcomes
- `src/app/auth/callback/route.ts` (GET handler) implemented.
- `src/app/invite/page.tsx` shows the invitation landing page with an accept button
  that initiates the Supabase Auth sign-in (magic link / email OTP).
- No raw token is read, stored, or logged — only the opaque session exchange.

### Todo List
1. Create `src/app/auth/callback/route.ts` as a Next.js Route Handler (GET).
2. Implement code exchange → session → membership activation → redirect logic.
3. Handle error cases: expired invitation, already accepted, no matching invitation
   — redirect to `/login?error=invalid_invitation`.
4. Write an `audit_logs` insert for successful acceptance.
5. Create `src/app/invite/page.tsx` as a client component that shows name/role
   from the invitation URL params and an "Accept invitation" button.
6. The invite page button calls `supabase.auth.verifyOtp()` or redirects to
   Supabase's hosted auth — depending on the configured auth flow.

### Relevant Context
- `src/lib/supabase/server.ts` — server client for callback route
- `src/middleware.ts` — session refresh; callback must not be protected by auth guard
- `docs/SECURITY_DESIGN.md` §2 — invitation flow requirements
- `docs/SYSTEM_ARCHITECTURE.md` §5 — invitation flow steps

### Acceptance Criteria
- Following a valid invitation link activates `organization_members.status='active'`.
- `invitations.status` becomes `'accepted'`.
- An `audit_logs` row is written.
- An expired or already-accepted invitation redirects to the error page.
- The `/auth/callback` route is excluded from auth middleware protection.

---

## Sub-Task 8 — Middleware route protection

**Status:** `[ ] pending`

### Intent
Currently `src/middleware.ts` calls `updateSession` but applies no redirect logic.
All `/app/*` and `/hr/*` routes are publicly accessible. This sub-task adds
the redirect guard.

Phase 2A guard is session-only (is the user logged in?). Role-based redirect
(sending employees away from `/hr/*`) is Phase 2B after membership queries
are fast and cached.

### Expected Outcomes
- Unauthenticated requests to `/app/**` → redirect to `/login`.
- Unauthenticated requests to `/hr/**` → redirect to `/login`.
- Authenticated requests to `/login` → redirect to `/app/dashboard`.
- `/`, `/login`, `/invite/**`, `/auth/callback` remain publicly accessible.
- Session refresh still runs on all matched routes (existing behavior preserved).

### Todo List
1. Extend `updateSession` in `src/lib/supabase/update-session.ts` to accept an
   optional redirect configuration, OR handle redirects directly in
   `src/middleware.ts` after the `updateSession` call.
   Preferred: keep `updateSession` pure (session-only), add redirect logic in
   `middleware.ts` after the call.
2. Call `supabase.auth.getUser()` in middleware (after session refresh) to get
   the authenticated user.
3. Define `PROTECTED_EMPLOYEE_PREFIX = '/app'` and `PROTECTED_HR_PREFIX = '/hr'`.
4. If no user and path starts with a protected prefix → `NextResponse.redirect('/login')`.
5. If user exists and path is `/login` → redirect to `/app/dashboard`.
6. Preserve all existing cookie-mutation behavior from `updateSession`.

### Relevant Context
- `src/middleware.ts` — current implementation
- `src/lib/supabase/update-session.ts` — session refresh logic
- `docs/SECURITY_DESIGN.md` §9 — security test: "Unauthenticated request to protected route"

### Acceptance Criteria
- `curl /app/dashboard` without a session cookie returns a 307/302 to `/login`.
- `curl /hr/dashboard` without a session cookie returns a 307/302 to `/login`.
- `curl /` and `curl /login` are accessible without a session.
- `npm run build` and `npm run lint` pass.

---

## Sub-Task 9 — Login page real authentication wire-up

**Status:** `[ ] pending`

### Intent
The current login page (`src/app/login/page.tsx`) has demo redirect links in
place of real auth. This sub-task replaces them with a real `signInWithPassword`
call and session-derived redirect.

### Expected Outcomes
- Login form calls `supabase.auth.signInWithPassword({ email, password })`.
- On success, redirect to role-appropriate dashboard based on the user's
  `organization_members.role` (queried server-side after sign-in).
- On failure, display an error message (no enumeration: same generic message for
  wrong email or wrong password).
- Password recovery link triggers `supabase.auth.resetPasswordForEmail(email)`.

### Implementation note
The role-based redirect requires knowing the user's role immediately after sign-in.
The safest Phase 2A approach: redirect all users to `/app/dashboard` after sign-in;
the middleware or the dashboard page's server component reads the actual role and
performs a final redirect if the user is `hr_admin`. This avoids a race condition
and keeps the login route simple.

### Todo List
1. Replace demo `<Link>` buttons in login page with a real form submit handler.
2. Call `createClient().auth.signInWithPassword(...)` on submit.
3. On success: `router.push('/app/dashboard')` — middleware will redirect HR admins
   once role-aware routing is added in Phase 2B.
4. On error: set an error state string (generic message only).
5. Password recovery: call `resetPasswordForEmail` and show a confirmation message.
6. Add a server-side check at the top of the login page: if user session exists,
   redirect to `/app/dashboard`.

### Relevant Context
- `src/app/login/page.tsx` — existing UI (must be preserved, only auth logic added)
- `src/lib/supabase/client.ts` — browser client
- `docs/SECURITY_DESIGN.md` §2 — "avoid account enumeration risk"

### Acceptance Criteria
- Valid credentials produce a session and redirect.
- Invalid credentials show a generic error without revealing which field is wrong.
- Already-authenticated user visiting `/login` is redirected.
- `npm run build` and `npm run lint` pass.

---

## Sub-Task 10 — TypeScript types for database schema

**Status:** `[ ] pending`

### Intent
Typed database rows prevent runtime errors and enforce the schema contract
throughout the application. Types should be generated from the live schema
(Supabase CLI) and placed in `src/types/`.

### Expected Outcomes
- `src/types/database.ts` exports the `Database` interface for the Phase 2A
  tables (auto-generated via `npx supabase gen types typescript`).
- All Supabase client calls in new server files use the typed client
  `createClient<Database>()`.
- Existing Phase 1 client files are updated to pass `Database` generic.

### Todo List
1. After migrations are applied, run:
   `npx supabase gen types typescript --local > src/types/database.ts`
   (or `--project-id <ref>` for remote).
2. Update `src/lib/supabase/client.ts`, `server.ts`, `update-session.ts` to
   import and use `Database` generic — minimal change, just add the type parameter.
3. Update `src/lib/supabase/service-role.ts` and `admin.ts` similarly.

### Relevant Context
- `src/lib/supabase/` — all client files
- `@supabase/supabase-js` supports `createClient<Database>()` generics

### Acceptance Criteria
- `npm run build` passes with no TypeScript errors on the generated types.
- No `any` types appear in new database query results.

---

## Sub-Task 11 — Migration verification and security tests

**Status:** `[ ] pending`

### Intent
Verify the schema enforces all cross-organization isolation and role boundaries
before marking Phase 2A complete. Tests are SQL-level (executed against the
local Supabase instance using `psql` or the Supabase dashboard SQL editor)
rather than Jest tests, which belong to Phase 7.

### Test matrix

| # | Test | Expected result |
|---|---|---|
| T1 | Unauthenticated SELECT from `organizations` | 0 rows (RLS deny) |
| T2 | Authenticated employee SELECTs `organization_members` from another org | 0 rows |
| T3 | Employee attempts UPDATE on `organization_members` | Error (no policy) |
| T4 | HR admin in Org A attempts SELECT on `organization_members` of Org B | 0 rows |
| T5 | INSERT into `platform_admins` as authenticated non-admin | Error (RLS deny) |
| T6 | SELECT from `platform_admins` as authenticated non-admin | 0 rows |
| T7 | INSERT `organization_members` with `department_id` from different org | FK violation |
| T8 | INSERT `invitations` with `department_id` from different org | FK violation |
| T9 | INSERT `mentor_assignments` with `mentor_user_id` from different org | FK violation |
| T10 | `audit_logs` UPDATE by authenticated user | Error (no UPDATE policy) |
| T11 | Unauthenticated GET `/app/dashboard` | 302 to `/login` |
| T12 | Unauthenticated GET `/hr/dashboard` | 302 to `/login` |
| T13 | Auth callback with expired invitation | Redirect to `/login?error=invalid_invitation` |
| T14 | Valid invitation callback | `organization_members.status='active'`, audit log written |

### Expected Outcomes
- All 14 tests produce the expected result.
- Results documented in `plans/phase-2a-test-results.md`.

### Todo List
1. Prepare SQL test scripts in `supabase/seed/test_rls.sql` (not applied to prod).
2. Execute each test against local Supabase instance.
3. Document results in `plans/phase-2a-test-results.md`.
4. Fix any policy gaps discovered.
5. Run `npm run lint` and `npm run build` one final time.

### Relevant Context
- `docs/SECURITY_DESIGN.md` §9 — required security tests (superset of Phase 2A tests)
- All migration files from Sub-Tasks 4–6

### Acceptance Criteria
- All 14 tests pass.
- `npm run build` produces 0 errors, 0 TypeScript errors.
- `npm run lint` produces 0 errors.
- `AGENTS.md` updated to reflect Phase 2A complete status.

---

## Migration ordering and dependency graph

```
Sub-Task 3: supabase init + link
    ↓
Sub-Task 4: Migration 001 — foundation tables (7 tables + triggers)
    ↓
Sub-Task 5: Migration 002 — RLS policies for foundation tables
    ↓
Sub-Task 6: Migration 003 — mentor_assignments + RLS
    ↓
Sub-Task 10: Generate TypeScript types from live schema
```

Sub-Tasks 1, 2, 7, 8, 9 are independent of the migration chain and can be
prepared in parallel, but Sub-Tasks 7/9 depend on Sub-Task 10 types for
full type safety.

Sub-Task 11 (tests) is the final gate and depends on all preceding sub-tasks.

---

## Acceptance criteria summary (Phase 2A exit gate)

1. `npm run build` passes with 0 errors.
2. `npm run lint` passes with 0 warnings or errors.
3. No TypeScript `any` in new files.
4. All 14 RLS and integration tests pass (Sub-Task 11).
5. `SUPABASE_SERVICE_ROLE_KEY` never appears in client-side bundles
   (verified by build output grep).
6. `.env.example` present and tracked; `.env.local` excluded from git.
7. `AGENTS.md` updated to reflect Phase 2A complete.
