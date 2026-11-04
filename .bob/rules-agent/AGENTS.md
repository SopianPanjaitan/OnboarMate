# Project Coding Rules (Non-Obvious Only)

## Identity and authorization
- User identity and `organization_id` must ALWAYS come from `auth.getUser()` on the server — never from route params, request body, or model-generated tool arguments.
- Membership role check pattern: query `organization_members` for `(organization_id, user_id, status='active')` and inspect `role` — there is no global role field on `profiles` to rely on.

## Provider adapter boundary
- The only place a vendor AI SDK (e.g. OpenAI, Anthropic) may be imported is inside `services/ai/adapters/`. Importing it anywhere else (route handlers, `features/`, `components/`) is a hard violation.
- Adapter must implement `LLMProvider` and `EmbeddingProvider` interfaces defined in `services/ai/` — do not call vendor SDK methods directly from orchestration logic.

## pgvector / embedding constraints
- `document_chunks.embedding` dimension (`N`) is not set until the model is chosen. Do not hardcode a dimension in any migration before the model is confirmed.
- After the model is selected, store `embedding_model TEXT NOT NULL` alongside the vector in every chunk row — required for future migration safety.
- Changing models requires re-embedding **all** chunks in the affected organization; dimension changes require a schema/index migration, not just a data update.

## Document processing status machine
Valid status transitions for `knowledge_documents.status`: `uploaded → processing → indexed | failed`. Only set `indexed` after **all** chunk rows are saved successfully. Never mark a document indexed based on partial progress.

## Tool calls
- MVP AI tools are read-only: `search_knowledge_base`, `get_my_onboarding_progress`, `list_my_pending_tasks`, `get_document_source`.
- Tool handler functions must never return rows the authenticated user is not authorized to see — apply authorization filter inside the tool, not only at the retrieval layer.
- Citations returned by the LLM must be validated against the retrieved chunk IDs before being stored or shown.

## Storage
- Generate storage object paths server-side using `{org_id}/{document_id}/{uuid}.{ext}`. Never construct paths from browser-supplied filenames.
- Downloads require a short-lived signed URL generated after a server-side authorization check — never expose bucket objects publicly.

## Database migrations
- One migration file per logical change. Never edit a committed migration; create a new one.
- Confirm embedding model and dimension before writing the migration that creates `document_chunks.embedding VECTOR(N)`.
