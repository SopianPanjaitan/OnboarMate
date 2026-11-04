# Project Documentation Rules (Non-Obvious Only)

## Where to find what
- All Phase 0 planning documents live in `OnboardMate_Phase0_Starter/docs/` — not in a top-level `docs/` yet (no app code scaffolded).
- `OnboardMate_Phase0_Starter/.bob/rules/onboardmate-project-rules.md` is the canonical short-form project rules reference.
- When application code is scaffolded, the proposed source layout lives in `docs/SYSTEM_ARCHITECTURE.md §4`.

## Counterintuitive structures
- `profiles.id` is a foreign key to `auth.users(id)` — it is NOT a separate auto-generated PK. Profiles must be inserted with the auth UID as the primary key.
- Authorization is organization-scoped via `organization_members`, not via a `role` column on `profiles`. Querying `profiles.role` for permissions is wrong.
- `document_chunks` does not have a vector column until the embedding model is finalized — do not document or reference a specific dimension until then.

## AI behavior
- The AI assistant responds in **Indonesian by default**. Documentation and test questions should account for this.
- The three-layer system prompt structure is documented in `docs/AI_AGENT_ARCHITECTURE.md §3` — refer to it for any prompt engineering work.
- "Provider-agnostic" does NOT mean models are fully interchangeable without migration; embedding models differ in dimension and semantics.

## Demo context
- Nexora Technologies is fictional. Any reference to it must note it is a synthetic demonstration organization.
- Departments: Human Resources, Engineering, Product & Design, Marketing, Finance & Operations.
