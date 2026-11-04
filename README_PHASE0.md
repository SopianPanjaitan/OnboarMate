# OnboardMate — Phase 0 Starter Pack

## Project decisions (confirmed)
- Product: OnboardMate — AI-Powered Employee Onboarding Assistant.
- Target: general companies and organizations.
- Delivery: full-stack web application with dashboards, authentication, database, document management, and AI Agent.
- AI architecture: provider-agnostic adapter design.
- Initial data: synthetic data for the fictional company Nexora Technologies.
- Registration: HR-managed account creation or invitation; no public self-registration.
- Proposed stack: Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Supabase Auth/PostgreSQL/Storage, pgvector, provider adapters for LLM and embeddings.

## What this pack is
This is a Phase 0 planning baseline for review and refinement in IBM Bob. It is not application code and does not represent a deployed or tested system.

## Suggested workspace setup
1. Create/open an empty project folder named `OnboardMate` in IBM Bob.
2. Initialize Git.
3. In IBM Bob Agent mode, run `/init` and review the generated `AGENTS.md` files.
4. Switch to Plan mode and submit `IBM_BOB_PHASE0_PROMPT.md`.
5. Approve only the planning tools and Markdown edits required to create/revise Phase 0 documents.
6. Review the resulting `docs/` and `plans/` files before approving Phase 1.
7. Keep credentials out of the repository. Use `.env.example` with placeholder values only.

## Fictional demo organization
Nexora Technologies is a fictional technology company. All employee names, policies, departments, and sample documents used for the demo must be clearly marked as synthetic. Never present them as real company policies.

## Phase 0 exit criteria
- Requirements and scope are explicit.
- User roles and permissions are documented.
- Architecture and major data flows are documented.
- Database entities and tenant boundaries are documented.
- AI provider abstraction and RAG limitations are documented.
- Security and privacy controls are documented.
- MVP phases and acceptance criteria are documented.
- Open decisions are listed rather than silently assumed.
