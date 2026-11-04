# Project Architecture Rules (Non-Obvious Only)

## Tenant isolation
- Every tenant-scoped table requires `organization_id` directly on the row OR an enforced parent relationship — inheriting org context through an unguarded join is insufficient for RLS.
- RLS alone is not the authorization boundary — server services must also perform explicit checks before any privileged operation. RLS is a defense-in-depth layer.
- Vector retrieval (pgvector) must filter on `organization_id`, `is_published = TRUE`, and `audience`/role before any chunk content is returned. Filtering only at the application layer after retrieval is a cross-tenant risk.

## Embedding model coupling
- The system has a hard architectural constraint: the `document_chunks.embedding VECTOR(N)` dimension is fixed per deployment. There is no multi-model vector column. Changing embedding models = full re-index operation + possible schema migration. This must be reflected in any plan touching Phase 5 or beyond.
- The `embedding_model` text column on `document_chunks` is required metadata, not optional — plans must include it in the migration.

## AI tool identity constraint
- AI tools must never receive `user_id` or `organization_id` as model-generated arguments — the server must inject verified session identity. This is an architectural invariant, not a code-review suggestion. Any design that passes identity through the tool call is wrong.

## Invitation flow coupling
- `invitations.auth_invitation_reference` stores only an opaque reference to the auth provider's invitation mechanism — not the raw token. The auth callback, not the application, must validate the token. Application code that reads and validates raw tokens is architecturally incorrect.
- Invitation role is limited to `employee` or `mentor`; HR Admins cannot be invited through the standard invitation flow — HR Admin privileges require a separate, audited provisioning path.

## Background processing boundary
- For MVP, document processing runs server-side with size/time limits. If the runtime limit is hit, the document status is set to `failed` and can be retried — it must NOT be silently abandoned or left in `processing` state. Any plan for Phase 4/5 must include the retry/failure status machine.

## Modular monolith boundaries (do not cross)
```
UI (app/ + components/)  →  Features (features/)  →  Services (services/)  →  Supabase client (lib/supabase/)
                                                         ↓
                                               AI adapters (services/ai/adapters/) ← only place vendor SDKs live
```
Cross-boundary imports (e.g. a component importing directly from `services/`) break the intended separation and must be flagged in planning/review.
