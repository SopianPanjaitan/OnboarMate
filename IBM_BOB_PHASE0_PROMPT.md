# IBM Bob Prompt — OnboardMate Phase 0

## How to use
1. Open the OnboardMate workspace in IBM Bob.
2. Run `/init` in Agent mode if the workspace has not been initialized. Review the generated AGENTS.md files.
3. Switch to Plan mode.
4. Paste the prompt below.
5. Approve the create-plan skill, Explore subagent, and Markdown edit requests when they match the task.
6. Review the files Bob creates under `plans/` and `docs/`.
7. Do not approve application-code implementation in Phase 0.

---

## PROMPT

# LAYER 1 — ROLE AND CONTEXT

Act as a Principal Software Architect, Senior Full-Stack Engineer, Database Architect, AI/RAG Architect, and Application Security Reviewer.

You are planning OnboardMate, a full-stack AI-powered Employee Onboarding Assistant for general companies and organizations.

The project will be developed with IBM Bob.

Confirmed decisions:
- Product: OnboardMate — AI-Powered Employee Onboarding Assistant.
- Target: general companies and organizations.
- Delivery: full website with employee dashboard, HR dashboard, authentication, database, document management, and AI Agent.
- AI architecture: provider-agnostic LLM and embedding adapters.
- Initial dataset: synthetic data for Nexora Technologies, a fictional technology company.
- Registration: HR-managed account creation/invitation only. No public self-registration.
- Proposed stack: Next.js App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui, Supabase Auth, PostgreSQL, private Supabase Storage, and pgvector.
- MVP is a modular monolith. Avoid premature microservices.

Nexora Technologies is fictional. Demo policies and employee records must be labeled as synthetic demonstration content.

# LAYER 2 — TASK AND REQUIREMENTS

This is Phase 0 only: requirements, planning, architecture, and technical documentation.

First inspect the workspace. If it is empty, do not assume application code already exists. Read any existing project documentation and preserve it where relevant.

Use the IBM Bob `create-plan` planning workflow.

Create or update these documents:

1. `docs/PROJECT_REQUIREMENTS.md`
2. `docs/SYSTEM_ARCHITECTURE.md`
3. `docs/DATABASE_SCHEMA.md`
4. `docs/AI_AGENT_ARCHITECTURE.md`
5. `docs/SECURITY_DESIGN.md`
6. `docs/DEVELOPMENT_ROADMAP.md`
7. `plans/phase-0-architecture-plan.md`

Requirements to cover:

A. Product and scope
- Product goals and non-goals.
- Functional and non-functional requirements.
- MVP boundaries and acceptance criteria.
- Core user journeys.

B. Roles and invitation-only access
- HR Admin, Employee, Mentor, and restricted Platform Super Admin.
- HR Admin may invite employees and mentors in their organization.
- Do not allow HR Admin to grant Platform Super Admin.
- Define a safe process for granting HR Admin privileges.
- No public self-registration.
- Include invitation expiry, revocation, acceptance, and duplicate-email handling.

C. Organization and demo data
- Organization-scoped membership and permissions.
- Fictional Nexora Technologies.
- Departments: Human Resources, Engineering, Product & Design, Marketing, Finance & Operations.
- Synthetic demo users and fictional policy documents.
- Mark all demo policies as fictional, not real company policies.

D. System architecture
- Next.js modular monolith.
- Supabase Auth, PostgreSQL, private Storage, pgvector.
- Server-side authorization and business logic.
- Clear separation of UI, services, data access, AI orchestration, RAG, and provider adapters.
- Document ingestion and query data flows.
- Deployment topology.

E. Database
Include at least:
- organizations
- profiles
- departments
- organization_members
- invitations
- onboarding_templates
- template_tasks
- onboarding_assignments
- task_progress
- knowledge_documents
- document_chunks
- conversations
- messages
- audit_logs

Specify keys, relationships, constraints, indexes, and RLS principles.

F. Provider-agnostic AI and RAG
- Define LLMProvider and EmbeddingProvider interfaces.
- Isolate vendor SDKs in adapters.
- Explain that changing embedding models requires re-embedding; changing vector dimension may require migration/index changes.
- Design retrieval filters for organization, publication status, audience, and role.
- Validate citations against retrieved chunks.
- Include abstention behavior when evidence is insufficient.
- Treat retrieved document text as untrusted data, not system instructions.
- MVP AI tools are read-only:
  `search_knowledge_base`,
  `get_my_onboarding_progress`,
  `list_my_pending_tasks`,
  `get_document_source`.
- Derive user and organization context from the verified server session, never from model-generated arguments.

G. Document processing
- MVP text-based PDF and DOCX.
- Private storage.
- File type/size validation.
- Text extraction, chunking, embeddings, processing status, retry.
- OCR for scanned PDFs is out of scope for MVP.
- Do not claim a document is indexed before successful processing.

H. Security
- RLS for all tenant-scoped tables.
- Private storage and authorized downloads.
- Server-only service role and AI secrets.
- Prompt injection protection.
- Audit logging.
- Cross-tenant and role-isolation test cases.

I. Roadmap
Create phases 0–8 with scope, dependencies, deliverables, acceptance criteria, and tests.

# LAYER 3 — CONSTRAINTS AND OUTPUT

- Do not create application source code.
- Do not install dependencies.
- Do not run database migrations or create cloud resources.
- Do not require real API keys or credentials.
- Do not silently choose a specific LLM or embedding vendor.
- Do not assume embedding dimensions before a model is selected.
- Do not use real employee data.
- Do not enable public registration.
- Do not weaken tenant isolation for convenience.
- Avoid unnecessary microservices and premature complexity.
- Use current official documentation when validating framework/provider-specific details.
- Explicitly label assumptions and unresolved decisions.
- Identify contradictions and propose corrections rather than hiding them.
- Keep Phase 0 limited to Markdown planning and architecture documents.

Output:
- The six documents under `docs/`.
- The implementation plan under `plans/phase-0-architecture-plan.md`.
- A concise architecture decision record or decision section covering confirmed decisions and open decisions.
- Mermaid diagrams for system architecture, invitation flow, document ingestion, RAG query flow, and database relationships where useful.
- A final review checklist with risks, unresolved decisions, and Phase 0 exit criteria.

Before finishing, verify that all documents agree with one another, especially roles, invitation rules, tenant isolation, AI provider abstraction, and embedding migration constraints.

Stop after Phase 0. Do not begin Phase 1.
