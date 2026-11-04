# Project Requirements — OnboardMate

## 1. Product summary
OnboardMate is a full-stack, AI-powered employee onboarding assistant for general companies and organizations. It helps new employees understand approved organizational information, complete onboarding tasks, and find reliable answers from HR-approved documents. HR administrators manage employees, onboarding templates, documents, and progress.

## 2. Product goals
1. Centralize approved onboarding information.
2. Reduce repetitive HR questions by making trusted information easier to find.
3. Give employees a clear view of their onboarding tasks and progress.
4. Provide AI answers grounded in authorized organizational documents and show source references.
5. Give HR a practical way to manage onboarding content and monitor completion.

## 3. Out of scope for MVP
- Payroll, attendance, leave transaction processing, performance management, recruitment/ATS, and full HRIS functionality.
- Automatic employment decisions or legal interpretation.
- Public self-registration.
- OCR for scanned PDFs.
- WhatsApp/Slack/Teams integrations.
- Voice assistant.
- Advanced workflow automation and complex multi-tenant billing.
- Training/LMS authoring.

## 4. User roles
Roles are organization-scoped through `organization_members`.

### HR Admin
- Invite employees and mentors into their organization.
- Manage employee profiles and department assignment.
- Create and manage onboarding templates and tasks.
- Upload, categorize, publish, archive, and delete authorized knowledge documents.
- View onboarding progress for employees in their organization.
- View organization-level reports.
- Cannot access another organization's data.

### Employee
- View and update permitted parts of their own profile.
- View their own onboarding assignment and tasks.
- Mark eligible tasks complete, subject to configured completion rules.
- Ask the AI assistant questions.
- View only documents available to their role/audience.
- View their own conversations.

### Mentor
- View assigned mentees and onboarding status only where explicitly assigned.
- Provide guidance or comments if that capability is enabled.
- Cannot manage organization-wide documents or HR settings by default.

### Platform Super Admin
- Platform-level operational role, not a routine organization role.
- Used only for controlled platform support and organization provisioning.
- Must not be exposed as a normal selectable role during employee invitation.

## 5. Registration and invitation
- No public sign-up route.
- HR Admin creates an employee/mentor invitation using a server-side privileged operation.
- Invitation is bound to an organization, intended email, role, and optional department.
- Invite recipient completes account activation through the authentication provider's secure invitation flow.
- Invitation token must be time-limited and single-use where supported.
- HR Admin cannot grant themselves or another user Platform Super Admin.
- Granting HR Admin privileges must require an existing authorized organization owner/platform-level process; do not allow privilege escalation through a normal employee invite.
- Re-invitation, expired invitation, already-registered email, and revoked invitation states must be handled.

## 6. Functional requirements

### Authentication and access
- Login, logout, session handling, password recovery.
- Organization membership and role checks on server-side operations.
- Protected employee and HR routes.
- Invitation-only account activation.

### Employee experience
- Dashboard with onboarding progress and upcoming/pending tasks.
- Checklist grouped by onboarding stage or due date.
- Task detail with instructions and related resources.
- Knowledge center with role-appropriate documents.
- AI assistant with conversation history and document citations.
- Profile page.

### HR experience
- Dashboard with employee count, onboarding status summaries, and pending items.
- Employee list, employee detail, invitation management.
- Department management.
- Onboarding template and task management.
- Document upload, metadata, processing status, publication status, and audience controls.
- Basic reports and audit history for sensitive operations.

### AI assistant
- Accept employee questions.
- Retrieve only relevant documents that the user is authorized to access.
- Answer using retrieved context and include source references.
- Clearly state when evidence is insufficient or unavailable.
- Ask clarifying questions when needed.
- Use authorized read-only tools for MVP: knowledge search, own progress, own pending tasks, and document source lookup.
- Any write action must be separately authorized, confirmed, and audited; do not allow arbitrary AI database writes.

### Document management
- MVP supports text-based PDF and DOCX, with file size/type validation.
- Store originals in a private storage bucket.
- Extract text, chunk it, generate embeddings, and index it.
- Track processing states: uploaded, processing, indexed, failed, archived.
- Scanned PDF OCR is out of scope for MVP and must be reported as unsupported.

## 7. Non-functional requirements
- Responsive desktop and mobile layouts.
- TypeScript strict mode and maintainable modular architecture.
- Server-side authorization and tenant isolation.
- Private storage for internal documents.
- Useful error messages without leaking secrets or personal data.
- Logging of important administrative actions.
- Automated tests for critical authorization, onboarding, and AI retrieval flows.
- Accessible forms and navigation.
- Environment-specific configuration; no secrets committed to source control.

## 8. Fictional demo organization
**Nexora Technologies** — fictional software and digital transformation company.

Departments:
- Human Resources
- Engineering
- Product & Design
- Marketing
- Finance & Operations

Synthetic demo users:
- Amanda Putri — HR Admin
- Daniel Pratama — Engineering Employee
- Sarah Wijaya — Product & Design Employee
- Michael Tan — Engineering Mentor

Synthetic demo knowledge documents:
- Employee Handbook
- Leave and Attendance Policy
- IT Access and Security Guide
- Code of Conduct
- First 30 Days Onboarding Guide
- Expense Reimbursement Guide

All demo content must include a visible or metadata-level disclaimer: "Fictional demonstration content — not a real company policy."

## 9. MVP acceptance criteria
1. An invited user can activate an account and log in.
2. Public users cannot create accounts.
3. HR Admin can invite an employee/mentor in their organization.
4. Employee and HR routes enforce server-side role authorization.
5. Employees see only their own onboarding tasks and progress.
6. HR can create an onboarding template and assign it to an employee.
7. HR can upload an allowed document and see its processing state.
8. An indexed document can be retrieved by a relevant question.
9. AI responses cite retrieved sources and abstain when no adequate evidence exists.
10. Cross-organization access tests fail safely.
11. Critical workflows have automated tests.
12. The application can be deployed with environment variables and without committing secrets.
