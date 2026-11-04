# Development Roadmap — OnboardMate

## Phase 0 — Planning and architecture
Deliverables:
- Project requirements.
- System architecture.
- Database schema and RLS strategy.
- AI Agent/RAG architecture.
- Security design.
- Development roadmap.
- Open decisions and acceptance criteria.

Exit gate: human review and approval of scope, architecture, data model, and security.

## Phase 1 — Foundation and UI
Scope:
- Initialize Next.js App Router and TypeScript strict mode.
- Configure Tailwind CSS and shadcn/ui.
- Establish reusable layout and design tokens.
- Build public landing page, login screen, employee shell, and HR shell.
- Use clearly labeled UI-only placeholders.

Acceptance:
- Application starts and production build succeeds.
- Responsive layouts work.
- No real auth or AI claims are shown as implemented.

## Phase 2 — Authentication, invitations, database, and RLS
Scope:
- Supabase project configuration.
- Schema migrations and seed structure.
- Auth/session handling.
- HR invitation workflow.
- Organization membership and role guards.
- RLS policies and authorization tests.

Acceptance:
- Public registration is unavailable.
- Invited users can activate accounts.
- Employee, mentor, and HR permissions are enforced server-side.
- Cross-tenant access tests are denied.

## Phase 3 — Onboarding module
Scope:
- Departments.
- Onboarding templates and tasks.
- Assignments.
- Employee checklist.
- Progress calculation.
- Employee and HR dashboards backed by database data.

Acceptance:
- HR creates a template and assigns it.
- Employee sees only their own tasks.
- Completion updates progress consistently.

## Phase 4 — HR document management
Scope:
- Private storage.
- Upload validation.
- Document metadata and categories.
- Publication/audience controls.
- Processing status and retry states.

Acceptance:
- HR uploads permitted PDF/DOCX.
- Unauthorized users cannot access private files.
- Unsupported/scanned documents are reported clearly.

## Phase 5 — RAG knowledge base
Scope:
- Text extraction.
- Chunking and metadata.
- Embedding provider adapter.
- pgvector storage and retrieval.
- Tenant/audience filtering.
- Citation metadata.

Acceptance:
- Relevant question retrieves the correct approved document chunks.
- Unauthorized and unpublished documents are not retrieved.
- Changing embedding model is documented as a re-index/migration operation.

## Phase 6 — AI Assistant and read-only tools
Scope:
- LLM provider adapter.
- AI orchestration.
- Three-layer system prompt.
- Chat UI and history.
- Knowledge search tool.
- Own-progress and pending-task tools.
- Citation validation and abstention.

Acceptance:
- Grounded answers cite actual retrieved sources.
- Unsupported questions receive a clear limitation response.
- Tool calls cannot override server-derived identity or tenant context.

## Phase 7 — Testing and hardening
Scope:
- Unit, integration, and end-to-end tests.
- AI evaluation dataset.
- Security review.
- Accessibility and responsive review.
- Error handling and performance.

Acceptance:
- Critical tests pass.
- No unresolved critical/high security issue.
- AI evaluation results are documented.

## Phase 8 — Deployment and Capstone preparation
Scope:
- Production environment configuration.
- Deployment.
- Seed synthetic demo organization.
- README and user guide.
- Architecture and demo documentation.
- Demonstration script.

Acceptance:
- Application is accessible in target environment.
- No secrets are committed.
- Demo can be repeated from a clean setup.
- All synthetic content is clearly labeled.

## Working agreement
- Implement one phase at a time.
- Do not silently expand scope.
- Review database/security changes before applying them.
- Run tests after each phase.
- Keep documentation synchronized with implementation.
- Do not claim completion without evidence.
