/**
 * Nexora Technologies — Fictional demonstration data.
 * ⚠️ ALL data in this file is entirely synthetic and does not represent
 * any real organization, person, or policy.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TaskStatus = "completed" | "in_progress" | "pending" | "blocked";

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  stage: "Pre-boarding" | "Week 1" | "Week 2" | "Week 4";
  status: TaskStatus;
  dueDate: string;
  required: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  version: number;
  audience: string;
  updatedAt: string;
  /** Rich text content for AI context */
  content: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "employee" | "mentor" | "hr_admin";
  department: string;
  jobTitle: string;
  startDate: string;
  mentorName?: string;
}

export interface DemoEmployee {
  employee: Employee;
  tasks: OnboardingTask[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
    currentStage: string;
  };
}

// ---------------------------------------------------------------------------
// Active demo employee (Andi Pratama — Software Engineer)
// ---------------------------------------------------------------------------

export const DEMO_EMPLOYEE: Employee = {
  id: "emp-001",
  name: "Andi Pratama",
  email: "andi.pratama@nexora.demo",
  role: "employee",
  department: "Engineering",
  jobTitle: "Software Engineer",
  startDate: "November 1, 2026",
  mentorName: "Eko Wijaya",
};

export const DEMO_TASKS: OnboardingTask[] = [
  {
    id: "task-01",
    title: "Sign employment contract",
    description: "Review and sign your employment contract via HR portal.",
    stage: "Pre-boarding",
    status: "completed",
    dueDate: "Oct 28",
    required: true,
  },
  {
    id: "task-02",
    title: "Complete IT equipment form",
    description: "Submit laptop and peripheral preferences to the IT team.",
    stage: "Pre-boarding",
    status: "completed",
    dueDate: "Oct 30",
    required: true,
  },
  {
    id: "task-03",
    title: "ID and bank detail submission",
    description: "Submit government ID and bank account details for payroll setup.",
    stage: "Pre-boarding",
    status: "completed",
    dueDate: "Oct 30",
    required: true,
  },
  {
    id: "task-04",
    title: "Attend orientation session",
    description: "Join the company-wide orientation on your first day.",
    stage: "Week 1",
    status: "completed",
    dueDate: "Nov 1",
    required: true,
  },
  {
    id: "task-05",
    title: "Review employee handbook",
    description: "Read the Nexora Technologies employee handbook (v2). Focus on code of conduct, leave policy, and communication guidelines.",
    stage: "Week 1",
    status: "in_progress",
    dueDate: "Nov 5",
    required: true,
  },
  {
    id: "task-06",
    title: "Set up development environment",
    description: "Follow the Development Environment Setup Guide in the Knowledge Center. Install required tools and configure access.",
    stage: "Week 1",
    status: "in_progress",
    dueDate: "Nov 6",
    required: true,
  },
  {
    id: "task-07",
    title: "Schedule meet-and-greet with team",
    description: "Book 30-min introductory calls with each team member via the calendar invite template HR will send.",
    stage: "Week 1",
    status: "pending",
    dueDate: "Nov 7",
    required: false,
  },
  {
    id: "task-08",
    title: "Complete security awareness training",
    description: "Finish the mandatory cybersecurity awareness module on the LMS. Score ≥80% to pass.",
    stage: "Week 2",
    status: "pending",
    dueDate: "Nov 10",
    required: true,
  },
  {
    id: "task-09",
    title: "Meet with assigned mentor",
    description: "First structured session with your onboarding mentor Eko Wijaya. Discuss goals and expectations.",
    stage: "Week 2",
    status: "pending",
    dueDate: "Nov 11",
    required: false,
  },
  {
    id: "task-10",
    title: "Submit 30-day check-in form",
    description: "Complete the onboarding feedback form to share your early experience and flag any blockers.",
    stage: "Week 4",
    status: "pending",
    dueDate: "Nov 28",
    required: false,
  },
];

export const DEMO_PROGRESS = {
  completed: DEMO_TASKS.filter((t) => t.status === "completed").length,
  total: DEMO_TASKS.length,
  percentage: Math.round(
    (DEMO_TASKS.filter((t) => t.status === "completed").length / DEMO_TASKS.length) * 100
  ),
  currentStage: "Week 1",
};

// ---------------------------------------------------------------------------
// Knowledge base documents with rich content for AI context
// ---------------------------------------------------------------------------

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doc-001",
    title: "Employee Handbook",
    description: "Company policies, code of conduct, benefits, and procedures.",
    category: "Policy",
    version: 2,
    audience: "all_employees",
    updatedAt: "Oct 2026",
    content: `
# Nexora Technologies Employee Handbook v2
[FICTIONAL DEMO DOCUMENT — NOT REAL POLICY]

## 1. Welcome
Welcome to Nexora Technologies! This handbook covers your rights, responsibilities, and the resources available to you.

## 2. Code of Conduct
- Treat all colleagues with respect and professionalism.
- Maintain confidentiality of company and client information.
- Report ethical concerns to HR or your manager.
- Zero tolerance for harassment, discrimination, or dishonesty.

## 3. Working Hours
- Core hours: 09:00–17:00 WIB (Jakarta), Monday–Friday.
- Flexible start/end times within ±2 hours with manager approval.
- Remote work available up to 3 days per week for eligible roles.

## 4. Leave Policy
- Annual leave: 12 working days per year, accrued pro-rata from start date.
- Sick leave: up to 14 days per year with a medical certificate for absences >2 days.
- Public holidays: follow the national public holiday calendar.
- Submit leave requests via the HR portal at least 3 working days in advance.
- Carry-over: up to 5 unused days may be carried to the following year.

## 5. Compensation & Benefits
- Salary reviewed annually in January.
- Health insurance: Nexora covers employee + 1 dependent.
- Internet allowance: IDR 500,000/month for remote-eligible employees.
- Learning budget: IDR 5,000,000/year for courses, conferences, and certifications.

## 6. Performance Reviews
- Formal reviews conducted bi-annually (June and December).
- Goal-setting workshop in January each year.
- Feedback encouraged throughout the year via 1:1s with your manager.

## 7. IT and Security
- All devices must have full-disk encryption enabled.
- Use a password manager; minimum 16-character passwords on critical systems.
- Report suspected phishing or security incidents to security@nexora.demo immediately.
- Personal use of company equipment is permitted within reason.

## 8. HR Contacts
- HR Lead: Sarah Wulandari — sarah.w@nexora.demo
- IT Support: helpdesk@nexora.demo
- Finance/Payroll: payroll@nexora.demo
    `.trim(),
  },
  {
    id: "doc-002",
    title: "IT Security Guidelines",
    description: "Acceptable use policy, password standards, and device management.",
    category: "Security",
    version: 1,
    audience: "all_employees",
    updatedAt: "Sep 2026",
    content: `
# IT Security Guidelines — Nexora Technologies
[FICTIONAL DEMO DOCUMENT — NOT REAL POLICY]

## Password Policy
- Minimum length: 16 characters for critical systems, 12 for others.
- Use a company-approved password manager (Bitwarden or 1Password).
- Enable MFA on all company accounts — mandatory.
- Never share passwords; use shared credential vaults for team accounts.

## Device Management
- All company laptops must have FileVault (macOS) or BitLocker (Windows) enabled.
- Install company MDM profile before connecting to internal systems.
- Lock your screen whenever you leave your desk (Win+L / Cmd+Ctrl+Q).
- Report lost or stolen devices to IT within 1 hour.

## Network Access
- Use the company VPN (Tailscale) when accessing internal resources remotely.
- Do not use public Wi-Fi without VPN active.
- Home routers: use WPA3 or WPA2-AES encryption.

## VPN Setup
1. Request Tailscale access from helpdesk@nexora.demo with your employee ID.
2. Download the Tailscale client from tailscale.com.
3. Sign in with your Nexora Google account.
4. Once approved, connect via the Tailscale tray icon.
5. Verify connection: run 'tailscale status' in terminal.

## Phishing and Social Engineering
- Nexora will never ask for your password via email or chat.
- Report suspicious emails to security@nexora.demo.
- When in doubt, call the sender to verify before clicking links.

## Incident Response
- Suspected breach: immediately notify security@nexora.demo and your manager.
- Do not attempt to investigate on your own.
- IT will contain and investigate within 4 hours of report.
    `.trim(),
  },
  {
    id: "doc-003",
    title: "Development Environment Setup Guide",
    description: "Step-by-step instructions for setting up your local dev environment.",
    category: "Technical",
    version: 3,
    audience: "all_employees",
    updatedAt: "Nov 2026",
    content: `
# Development Environment Setup Guide v3
[FICTIONAL DEMO DOCUMENT — NOT REAL POLICY]

## Prerequisites
- MacBook Pro M-series (issued by IT) or approved personal device.
- Access to the company GitHub organization (request via helpdesk).
- Tailscale VPN installed and connected.

## Step 1: Core Tooling
\`\`\`bash
# Install Homebrew (macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
nvm use 20

# Install pnpm
npm install -g pnpm
\`\`\`

## Step 2: Clone Repositories
\`\`\`bash
git clone git@github.com:nexora-demo/platform.git
git clone git@github.com:nexora-demo/api.git
\`\`\`

## Step 3: Environment Variables
1. Copy \`.env.example\` to \`.env.local\` in each repo.
2. Request real values from your team lead via 1Password shared vault.

## Step 4: Local Database
\`\`\`bash
# Start Supabase locally
npx supabase start
# Apply migrations
npx supabase db push
\`\`\`

## Step 5: Start Development Server
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
Open http://localhost:3000 — you should see the app running.

## Troubleshooting
- Port 3000 in use: \`lsof -ti:3000 | xargs kill\`
- Node version issues: check \`.nvmrc\` at repo root.
- DB connection errors: ensure Tailscale is connected and Supabase is running.
- Slack channel: #dev-help for quick questions.
    `.trim(),
  },
  {
    id: "doc-004",
    title: "Leave and Attendance Policy",
    description: "Annual leave, sick leave, public holidays, and absence procedures.",
    category: "Policy",
    version: 1,
    audience: "all_employees",
    updatedAt: "Aug 2026",
    content: `
# Leave and Attendance Policy — Nexora Technologies
[FICTIONAL DEMO DOCUMENT — NOT REAL POLICY]

## Annual Leave
- 12 working days per calendar year.
- Pro-rated for employees who join mid-year.
- Request via HR portal at least 3 working days in advance.
- Approval at manager's discretion; peak periods may require 5 days notice.
- Carry-over: maximum 5 days to the following year; expires March 31.
- Unused leave beyond carry-over limit is forfeited (not paid out during employment).

## Sick Leave
- Up to 14 calendar days per year.
- For absences of 1–2 days: self-certification via HR portal.
- For absences of 3+ consecutive days: medical certificate required within 2 working days of return.
- Uncertified sick leave beyond 2 days may be treated as unpaid leave.

## Public Holidays
- Nexora observes all Indonesian national public holidays.
- Holiday calendar published by HR in January each year.
- Work on a public holiday requires prior manager approval and yields a day off in lieu.

## Unpaid Leave
- Available after 12 months of service, subject to approval.
- Maximum 30 calendar days per request.
- Benefits may be suspended during unpaid leave periods.

## How to Submit Leave
1. Log in to the HR portal at hr.nexora.demo.
2. Navigate to My Leave > New Request.
3. Select leave type, dates, and add any notes.
4. Submit — your manager receives an approval request.
5. Approved or rejected within 2 working days.

## Attendance
- Lateness beyond 15 minutes must be notified to your manager.
- Three or more instances of unexplained lateness per month trigger a performance discussion.
    `.trim(),
  },
  {
    id: "doc-005",
    title: "Onboarding Welcome Pack",
    description: "Introduction to Nexora Technologies, your team, and key contacts.",
    category: "Onboarding",
    version: 1,
    audience: "all_employees",
    updatedAt: "Nov 2026",
    content: `
# Onboarding Welcome Pack — Nexora Technologies
[FICTIONAL DEMO DOCUMENT — NOT REAL POLICY]

## About Nexora Technologies
Nexora Technologies builds AI-powered enterprise SaaS products for workforce management and employee experience. Founded in 2019, the company currently has ~120 employees across Jakarta, Singapore, and remote teams throughout Southeast Asia.

## Your First Week
Day 1: HR orientation, receive equipment, meet your manager and team.
Day 2: Complete IT setup, access provisioning, and required training modules.
Day 3–5: Shadow your team, attend team stand-up, begin onboarding checklist.

## Key Contacts
- HR: Sarah Wulandari — sarah.w@nexora.demo — Slack: @sarah.w
- IT Support: helpdesk@nexora.demo — Response SLA: 4 hours
- Payroll: payroll@nexora.demo — for salary, bank details, expense claims
- Your Mentor: Eko Wijaya — eko.w@nexora.demo — Slack: @eko.w
- Your Manager: (will be confirmed by HR on Day 1)

## Important Slack Channels
- #general — company-wide announcements
- #engineering — all engineering topics
- #dev-help — technical questions and support
- #random — social channel
- #onboarding-cohort-nov-2026 — your cohort channel

## Useful Links (internal, require VPN)
- HR Portal: hr.nexora.demo
- Engineering Wiki: wiki.nexora.demo
- Expense Claims: expenses.nexora.demo
- Benefits Portal: benefits.nexora.demo

## The Nexora Values
1. Build with empathy — our users are real people.
2. Default to transparency — share context, not just conclusions.
3. Own your work — start to finish.
4. Learn openly — mistakes are welcome when they lead to growth.
    `.trim(),
  },
];

// ---------------------------------------------------------------------------
// Suggested AI prompts per context
// ---------------------------------------------------------------------------

export const AI_SUGGESTIONS = {
  general: [
    "Apa kebijakan cuti tahunan di Nexora?",
    "Bagaimana cara setup VPN Tailscale?",
    "Siapa kontak HR saya?",
    "Apa yang harus saya selesaikan minggu ini?",
  ],
  onboarding: [
    "Jelaskan langkah-langkah setup environment development",
    "Kapan deadline task onboarding saya yang belum selesai?",
    "Apa saja yang perlu disiapkan sebelum meet-and-greet?",
    "Bagaimana cara mengajukan cuti pertama kali?",
  ],
  hr: [
    "Berapa hari cuti sakit yang saya dapat?",
    "Bagaimana cara melaporkan insiden keamanan IT?",
    "Apa benefit kesehatan karyawan Nexora?",
    "Ke mana saya menghubungi payroll untuk klaim pengeluaran?",
  ],
  technical: [
    "Apa tools yang perlu diinstall untuk development?",
    "Bagaimana cara troubleshoot koneksi database lokal?",
    "Apa standar password untuk sistem perusahaan?",
    "Di mana saya bisa menemukan .env.example?",
  ],
};

// ---------------------------------------------------------------------------
// HR employee roster
// ---------------------------------------------------------------------------

export const HR_EMPLOYEES = [
  { id: "emp-001", name: "Andi Pratama", email: "andi.pratama@nexora.demo", role: "employee" as const, department: "Engineering", jobTitle: "Software Engineer", status: "active" as const, progress: DEMO_PROGRESS.percentage, startDate: "Nov 1, 2026" },
  { id: "emp-002", name: "Budi Santoso", email: "budi.santoso@nexora.demo", role: "employee" as const, department: "Product", jobTitle: "Product Designer", status: "active" as const, progress: 80, startDate: "Oct 15, 2026" },
  { id: "emp-003", name: "Citra Dewi", email: "citra.dewi@nexora.demo", role: "employee" as const, department: "Analytics", jobTitle: "Data Analyst", status: "invited" as const, progress: 0, startDate: "Nov 15, 2026" },
  { id: "emp-004", name: "Dian Rahayu", email: "dian.rahayu@nexora.demo", role: "employee" as const, department: "Marketing", jobTitle: "Marketing Manager", status: "active" as const, progress: 100, startDate: "Oct 1, 2026" },
  { id: "emp-005", name: "Eko Wijaya", email: "eko.w@nexora.demo", role: "mentor" as const, department: "Engineering", jobTitle: "Senior Engineer", status: "active" as const, progress: 100, startDate: "Jan 2025" },
  { id: "emp-006", name: "Fitri Handayani", email: "fitri.h@nexora.demo", role: "employee" as const, department: "Operations", jobTitle: "Operations Analyst", status: "active" as const, progress: 60, startDate: "Oct 20, 2026" },
];
