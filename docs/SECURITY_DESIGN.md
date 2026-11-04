# Security Design — OnboardMate

## 1. Security principles
- Least privilege.
- Deny by default.
- Server-side authorization.
- Tenant isolation.
- Private-by-default document storage.
- Secrets never shipped to the browser.
- Audit sensitive administrative operations.
- Treat user prompts and uploaded documents as untrusted input.

## 2. Authentication
- Use Supabase Auth.
- No public sign-up.
- HR-managed invitation or account provisioning.
- Secure invitation callback and session handling.
- Use server-side session verification for protected operations.
- Provide logout and password recovery flows.
- Avoid exposing whether arbitrary emails belong to an account where this could create account enumeration risk.

### Initial HR Admin provisioning
The first HR Admin of an organization cannot be created through the normal invitation flow because no HR Admin exists yet to send the invite. Provisioning must follow a controlled server-side path:

1. **Platform Super Admin** creates the organization record and provisions the first HR Admin account through a secure admin-only API or CLI script that uses the service-role key. This operation must be performed server-side only and must produce an audit event.
2. The provisioned HR Admin user receives a Supabase Auth invitation link generated server-side.
3. On first login the HR Admin activates their account; the `organization_members` row is set to `active`.
4. Subsequent HR Admin accounts within the organization are invited by the existing HR Admin through the normal invitation flow.

This path must never be reachable via a public endpoint. Any provisioning endpoint must require Platform Super Admin authentication and must be tested to confirm it is inaccessible to organization-level users.

## 3. Authorization
- Roles are organization-scoped through organization_members.
- Employee: own profile, tasks, progress, conversations, and authorized documents.
- Mentor: explicitly assigned mentees only.
- HR Admin: organization-scoped HR operations only — no visibility into other organizations' data.
- **Platform Super Admin:** tightly restricted to platform-level operations (creating organizations, provisioning first HR Admins, managing the platform). Platform Super Admin privileges must be stored and enforced separately from organization membership — Platform Super Admins do not hold `hr_admin` membership in tenant organizations and must not be able to access tenant data through normal HR routes. All Platform Super Admin actions must be audited.
- Enforce permissions in server services and database RLS; hiding a UI button is not authorization.

## 4. Tenant isolation
- Every tenant-owned row has organization_id or a securely enforced parent relationship.
- Derive organization context from authenticated membership, not client-supplied IDs.
- Apply RLS to all tenant-scoped tables.
- **Supabase service-role key bypasses RLS.** Server-side code using the service-role client must always perform explicit application-level authorization checks (session validation, organization membership, audience/role verification) before issuing queries or mutations. The service-role client must never be bundled for browser use.
- Vector retrieval must include organization, publication, audience, and role filters; for `selected_roles` documents the retrieval service must additionally join `document_access_roles` to confirm the requesting user's role is listed.
- Test attempts to access another organization's records and documents.

## 5. Storage
- Use private buckets for internal documents.
- Authorize upload/download through server checks or short-lived signed URLs.
- Validate extension, MIME type, file size, and file signature where practical.
- Generate storage paths server-side with organization/document identifiers.
- Do not trust filenames supplied by the browser.
- Prevent public listing and public read access.

## 6. Secrets and configuration
- Keep service-role credentials and LLM keys server-side only.
- Commit `.env.example` with placeholders, never real secrets.
- Ensure `.env*` secrets are ignored by Git.
- Use separate credentials for local, staging, and production environments.
- Rotate any credential accidentally exposed.

## 7. AI-specific threats
- Prompt injection in user messages and retrieved documents.
- Retrieval of HR-only or cross-tenant content.
- Model-generated tool arguments attempting to change user/organization identity.
- Fabricated citations.
- Excessive context disclosure.
- Unsafe file uploads and malicious document content.

Mitigations:
- Retrieved text is data, never system instruction.
- Apply authorization before retrieval and again before source display.
- Server derives user and tenant identity.
- Allowlist tools and validate arguments.
- Validate citations against retrieved chunk IDs.
- Limit file types, size, chunk count, and model context.
- Do not expose internal prompts, secrets, or raw database records.

## 8. Audit logging
Record at minimum:
- Invitation created, revoked, accepted.
- Employee role/department changes.
- Document upload, publish, archive, delete, and reprocess.
- Onboarding template changes and assignments.
- Sensitive administrative settings changes.

Do not store passwords, access tokens, raw invitation tokens, or unnecessary sensitive personal data in audit metadata.

## 9. Required security tests
- Unauthenticated request to protected route.
- Employee accessing HR route.
- Employee reading another employee's progress.
- Mentor accessing an unassigned employee.
- HR Admin accessing another organization.
- Employee retrieving HR-only document chunks.
- Employee retrieving a `selected_roles` document chunk for a role they do not hold.
- User attempting to submit a forged organization_id.
- Public access to private storage object.
- Service-role secret absent from client bundle.
- Prompt injection inside an uploaded document.
- Platform Super Admin route inaccessible to organization-level HR Admin.
- First HR Admin provisioning endpoint inaccessible without Platform Super Admin authentication.
