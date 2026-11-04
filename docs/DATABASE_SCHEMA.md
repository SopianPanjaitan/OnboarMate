# Database Schema — OnboardMate

## 1. Conventions
- PostgreSQL with UUID primary keys.
- `created_at` and `updated_at` timestamps where relevant.
- Tenant-owned records include `organization_id` directly or inherit it through a parent with equivalent RLS enforcement.
- Use foreign keys, indexes, unique constraints, and check constraints.
- `profiles.id` references the authentication user ID.
- Membership role is organization-scoped; do not store one global role on the profile as the source of authorization truth.
- **Composite tenant-aware foreign keys:** wherever a child table references a parent table that is itself tenant-scoped, the child must carry `organization_id` and reference the parent using a composite `(organization_id, parent_id)` key (backed by a composite unique constraint on the parent). This prevents cross-organization relationships at the database level and must not be replaced by application-only checks. Examples: `template_tasks` → `onboarding_templates`, `assignment_tasks` → their source records, `task_progress` → `onboarding_assignments`, `document_chunks` → `knowledge_documents`.

## 2. Core tables

### organizations
- `id UUID PK`
- `name TEXT NOT NULL`
- `slug TEXT UNIQUE NOT NULL`
- `description TEXT`
- `status TEXT NOT NULL`
- `created_at`, `updated_at`

### profiles
- `id UUID PK REFERENCES auth.users(id)`
- `full_name TEXT`
- `avatar_path TEXT`
- `job_title TEXT`
- `created_at`, `updated_at`

### departments
- `id UUID PK`
- `organization_id UUID FK`
- `name TEXT NOT NULL`
- `created_at`, `updated_at`
- Unique `(organization_id, name)`

### organization_members
- `id UUID PK`
- `organization_id UUID FK`
- `user_id UUID FK REFERENCES profiles(id)`
- `department_id UUID NULL FK`
- `role TEXT CHECK IN ('hr_admin','employee','mentor')`
- `status TEXT CHECK IN ('invited','active','suspended')`
- `created_at`, `updated_at`
- Unique `(organization_id, user_id)`

### invitations
- `id UUID PK`
- `organization_id UUID FK`
- `email TEXT NOT NULL`
- `role TEXT CHECK IN ('employee','mentor')`
- `department_id UUID NULL FK`
- `invited_by UUID FK`
- `auth_invitation_reference TEXT NULL`
- `status TEXT CHECK IN ('pending','accepted','expired','revoked')`
- `expires_at TIMESTAMPTZ`
- `created_at`, `updated_at`
- Add an index on normalized email and organization.
- Do not store raw invitation tokens.

### onboarding_templates
- `id UUID PK`
- `organization_id UUID FK`
- `name TEXT NOT NULL`
- `description TEXT`
- `is_active BOOLEAN DEFAULT TRUE`
- `created_by UUID FK`
- `created_at`, `updated_at`

### template_tasks
- `id UUID PK`
- `organization_id UUID FK` — must match parent `onboarding_templates.organization_id`
- `template_id UUID FK` — composite FK `(organization_id, template_id)` references `onboarding_templates(organization_id, id)`
- `title TEXT NOT NULL`
- `description TEXT`
- `stage TEXT`
- `sort_order INTEGER`
- `due_offset_days INTEGER NULL`
- `is_required BOOLEAN DEFAULT TRUE`
- `created_at`, `updated_at`
- Composite unique `(organization_id, template_id, id)` to support downstream composite FK references.

### onboarding_assignments
- `id UUID PK`
- `organization_id UUID FK`
- `template_id UUID FK`
- `employee_user_id UUID FK`
- `assigned_by UUID FK`
- `start_date DATE`
- `status TEXT CHECK IN ('not_started','in_progress','completed','cancelled')`
- `created_at`, `updated_at`
- Composite unique `(organization_id, id)` to support composite FK references from `assignment_tasks`.

### assignment_tasks (snapshot)
- `id UUID PK`
- `organization_id UUID FK`
- `assignment_id UUID FK` — composite FK `(organization_id, assignment_id)` references `onboarding_assignments(organization_id, id)`
- `source_template_task_id UUID NULL FK` — non-enforced reference to the originating `template_tasks` row; nullable to support manually created tasks.
- `title TEXT NOT NULL`
- `description TEXT`
- `stage TEXT`
- `sort_order INTEGER`
- `due_offset_days INTEGER NULL`
- `is_required BOOLEAN DEFAULT TRUE`
- `created_at`

> **Snapshot rationale:** When a template is assigned to an employee, the current `template_tasks` rows are copied into `assignment_tasks`. Subsequent edits to `template_tasks` (renaming, reordering, adding, removing tasks) do not affect in-progress or completed assignments. Progress is tracked against `assignment_tasks`, not `template_tasks`, so the employee's checklist remains stable throughout their onboarding.

### task_progress
- `id UUID PK`
- `organization_id UUID FK`
- `assignment_id UUID FK`
- `assignment_task_id UUID FK` — references `assignment_tasks(id)`; composite FK `(organization_id, assignment_id, assignment_task_id)` backed by composite unique on `assignment_tasks(organization_id, assignment_id, id)`
- `status TEXT CHECK IN ('pending','in_progress','completed','blocked')`
- `completed_at TIMESTAMPTZ NULL`
- `completed_by UUID NULL FK`
- `notes TEXT NULL`
- `created_at`, `updated_at`
- Unique `(assignment_id, assignment_task_id)`

### knowledge_documents
- `id UUID PK`
- `organization_id UUID FK`
- `title TEXT NOT NULL`
- `description TEXT`
- `storage_path TEXT NOT NULL`
- `file_name TEXT NOT NULL`
- `mime_type TEXT NOT NULL`
- `file_size_bytes BIGINT NOT NULL`
- `category TEXT`
- `status TEXT CHECK IN ('uploaded','processing','indexed','failed','archived')`
- `audience TEXT CHECK IN ('all_employees','hr_only','mentors_and_employees','selected_roles')`
- `is_published BOOLEAN DEFAULT FALSE`
- `version INTEGER DEFAULT 1 NOT NULL` — incremented each time HR explicitly publishes a new version of the document; used in citation metadata and retrieval.
- `superseded_by UUID NULL FK REFERENCES knowledge_documents(id)` — when a newer version is published, this points to the successor; allows the system to prefer the latest version and display deprecation notices.
- `uploaded_by UUID FK`
- `created_at`, `updated_at`
- Composite unique `(organization_id, id)` to support composite FK from `document_chunks`.

### document_access_roles
- `id UUID PK`
- `organization_id UUID FK`
- `document_id UUID FK` — composite FK `(organization_id, document_id)` references `knowledge_documents(organization_id, id)`
- `role TEXT CHECK IN ('employee','mentor','hr_admin')` — one row per role that should have access
- `created_at`
- Unique `(document_id, role)`

> **Publication rules:**
> - `audience = 'all_employees'`: accessible to all active organization members.
> - `audience = 'hr_only'`: accessible only to active `hr_admin` members.
> - `audience = 'mentors_and_employees'`: accessible to `employee` and `mentor` roles.
> - `audience = 'selected_roles'`: accessible only to roles listed in `document_access_roles` for that document. RLS and the retrieval service must join `document_access_roles` to determine eligibility; the `document_access_roles` table must have at least one row before a `selected_roles` document may be published.
> - `is_published = FALSE` documents are never returned by the RAG pipeline or employee-facing APIs regardless of `audience`.

### document_chunks
- `id UUID PK`
- `organization_id UUID FK`
- `document_id UUID FK` — composite FK `(organization_id, document_id)` references `knowledge_documents(organization_id, id)`
- `document_version INTEGER NOT NULL` — snapshot of `knowledge_documents.version` at chunk creation time; stored on each chunk so that citations can identify the exact version that was indexed.
- `chunk_index INTEGER NOT NULL`
- `content TEXT NOT NULL`
- `embedding VECTOR(N)` where N is fixed after the embedding model is selected
- `page_number INTEGER NULL`
- `metadata JSONB`
- `embedding_model TEXT NOT NULL`
- `created_at`
- Unique `(document_id, chunk_index)`

### conversations
- `id UUID PK`
- `organization_id UUID FK`
- `user_id UUID FK`
- `title TEXT`
- `created_at`, `updated_at`

### messages
- `id UUID PK`
- `organization_id UUID FK`
- `conversation_id UUID FK`
- `role TEXT CHECK IN ('user','assistant','tool')`
- `content TEXT NOT NULL`
- `citations JSONB`
- `provider_name TEXT NULL`
- `model_name TEXT NULL`
- `created_at`

### audit_logs
- `id UUID PK`
- `organization_id UUID NULL`
- `actor_user_id UUID NULL`
- `action TEXT NOT NULL`
- `resource_type TEXT`
- `resource_id UUID NULL`
- `metadata JSONB`
- `created_at`

## 3. Relationships
- Organization has many departments, members, templates, documents, assignments, and conversations.
- Profile can belong to multiple organizations through organization_members.
- Template has many template_tasks (compositely tenant-scoped).
- Employee has many onboarding_assignments; each assignment carries a snapshot of tasks in assignment_tasks.
- Assignment has many assignment_tasks (snapshot) and many task_progress rows keyed to assignment_tasks.
- Knowledge document has many document_chunks; document_access_roles lists per-role access when audience is `selected_roles`.
- Conversation has many messages.

## 4. Indexes
- `organization_members(organization_id, user_id)` unique.
- `departments(organization_id, name)` unique.
- `onboarding_templates(organization_id, id)` unique — supports composite FK from `template_tasks`.
- `onboarding_assignments(organization_id, employee_user_id, status)`.
- `onboarding_assignments(organization_id, id)` unique — supports composite FK from `assignment_tasks`.
- `assignment_tasks(organization_id, assignment_id, id)` unique — supports composite FK from `task_progress`.
- `task_progress(assignment_id, status)`.
- `knowledge_documents(organization_id, status, is_published)`.
- `knowledge_documents(organization_id, id)` unique — supports composite FK from `document_chunks` and `document_access_roles`.
- `document_access_roles(document_id, role)` unique.
- `document_chunks(document_id, chunk_index)` unique.
- `conversations(organization_id, user_id, updated_at DESC)`.
- Vector index appropriate to selected pgvector operator and embedding dimension.

## 5. RLS policy principles
- Enable RLS on every tenant-scoped table.
- Resolve organization membership from the authenticated user and `organization_members`.
- Employee reads only their own profile, assignments, task progress, and conversations.
- HR Admin reads/manages records only within organizations where they have active `hr_admin` membership.
- Mentor reads only explicitly assigned mentee records; do not grant organization-wide employee visibility.
- Knowledge retrieval requires same organization, published status, and matching audience/role; for `selected_roles` documents, join `document_access_roles` to confirm the requesting user's role is listed.
- `document_chunks` access must inherit document authorization; never rely only on a client filter.
- Invitations are visible/manageable only to authorized HR Admins in the same organization.
- Audit logs are not editable by ordinary users.
- **Supabase service-role key bypasses RLS at the database level.** Any server-side code that uses the service-role client must perform explicit application-level authorization checks (session validation, organization membership, audience/role filtering) before querying or mutating data. The service-role client must never be instantiated in browser bundles or in shared utilities that could be imported by client components.

## 6. Migration notes
- Confirm the embedding model and dimension before creating the final vector column/index.
- Changing embedding model requires re-embedding chunks; changing dimension may require a schema/index migration.
- Use migrations for all schema changes. Do not make undocumented manual production changes.
