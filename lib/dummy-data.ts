import type {
  BlockerLog,
  Employee,
  Goal,
  Project,
  ProjectMembership,
  Sprint,
  StatusTransition,
  Status,
  Task,
  TaskType,
} from "@/types";

export const TODAY = "2026-05-14";

export const projects: Project[] = [
  {
    id: "p-1",
    name: "SmartPM",
    description: "Agentic sprint board with AI assistant, analytics, and team management.",
  },
  {
    id: "p-2",
    name: "Customer Portal v2",
    description: "Rebuild the legacy support portal with self-service flows and AI ticket routing.",
  },
  {
    id: "p-3",
    name: "HR Platform Modernization",
    description: "Internal HR platform: onboarding, performance reviews, time-off, and people analytics.",
  },
  {
    id: "p-4",
    name: "Data Lake Migration",
    description: "Move the analytics warehouse off Snowflake onto a lakehouse architecture (Iceberg + Spark).",
  },
];

export const DEFAULT_PROJECT_ID = "p-1";

// Global employee pool. Source of truth for name/role/description/capacity.
// Projects "use" employees by adding ProjectMembership rows.
export const employees: Employee[] = [
  {
    id: "tm-1",
    name: "Emran Hossain",
    role: "Backend Engineer",
    description:
      "API and database specialist. Strong with authentication, rate limiting, and Postgres performance. Owns most of the API surface.",
    avatarInitial: "EH",
    weeklyCapacityPoints: 13,
  },
  {
    id: "tm-2",
    name: "Priya Sharma",
    role: "Frontend Engineer",
    description:
      "Design-system and component work. Lives in shadcn/Tailwind, comfortable with complex layout and accessibility.",
    avatarInitial: "PS",
    weeklyCapacityPoints: 13,
  },
  {
    id: "tm-3",
    name: "Marcus Lee",
    role: "Full-stack Engineer",
    description:
      "Bridges frontend and backend. Best fit for end-to-end features and tricky integration work (dnd-kit, OAuth, schema design).",
    avatarInitial: "ML",
    weeklyCapacityPoints: 13,
  },
  {
    id: "tm-4",
    name: "Hana Tanaka",
    role: "Mobile Engineer",
    description:
      "iOS/Android native and React Native. Push notifications, keychain, certificate / provisioning workflows.",
    avatarInitial: "HT",
    weeklyCapacityPoints: 13,
  },
  {
    id: "tm-5",
    name: "Diego Alvarez",
    role: "QA Engineer",
    description:
      "End-to-end and regression testing. Edge-case hunter — best owner for QA tickets and release-blocking checks.",
    avatarInitial: "DA",
    weeklyCapacityPoints: 10,
  },
  {
    id: "tm-6",
    name: "Aisha Khan",
    role: "Frontend Engineer",
    description:
      "Data viz and dashboards (Recharts, D3). Strong sense for information density and filterable views.",
    avatarInitial: "AK",
    weeklyCapacityPoints: 13,
  },
  {
    id: "p2-tm-1",
    name: "Lena Vargas",
    role: "Product Designer",
    description:
      "Design systems, motion, UX research. Owns the portal's visual language and runs usability sessions.",
    avatarInitial: "LV",
    weeklyCapacityPoints: 10,
  },
  {
    id: "p2-tm-2",
    name: "Owen Becker",
    role: "Backend Engineer",
    description:
      "Ticketing systems, GraphQL, RBAC and permissions. Strong with database migrations and audit trails.",
    avatarInitial: "OB",
    weeklyCapacityPoints: 13,
  },
  {
    id: "p2-tm-3",
    name: "Mira Joshi",
    role: "Frontend Engineer",
    description:
      "React forms, complex state machines, and inline validation. Best fit for the self-service intake flows.",
    avatarInitial: "MJ",
    weeklyCapacityPoints: 13,
  },
  {
    id: "p2-tm-4",
    name: "Theo Park",
    role: "ML Engineer",
    description:
      "NLP and classification. Built ticket-routing and intent-detection systems before. Owns the AI router work.",
    avatarInitial: "TP",
    weeklyCapacityPoints: 10,
  },
  {
    id: "p2-tm-5",
    name: "Sasha Reyes",
    role: "QA Engineer",
    description:
      "Accessibility specialist (WCAG, screen reader testing) and regression suites. Catches a11y blockers others miss.",
    avatarInitial: "SR",
    weeklyCapacityPoints: 10,
  },

  // ─────────── Additional pool (cross-project, recently joined) ───────────
  {
    id: "emp-101",
    name: "Maya Iyer",
    role: "Frontend Engineer",
    description:
      "React Server Components, Next.js App Router, complex routing. Loves wiring up forms with server actions.",
    avatarInitial: "MI",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-102",
    name: "Karim Boudou",
    role: "Backend Engineer",
    description:
      "Go microservices, gRPC, distributed systems. Owned the orchestration rewrite at his last company.",
    avatarInitial: "KB",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-103",
    name: "Yuki Sato",
    role: "DevOps Engineer",
    description:
      "Kubernetes, Terraform, GitHub Actions. Strong with secret management and zero-downtime deploys.",
    avatarInitial: "YS",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-104",
    name: "Felix Werner",
    role: "Data Engineer",
    description:
      "Spark, Airflow, dbt. Built lakehouse pipelines on Iceberg before. Strong on schema evolution and lineage.",
    avatarInitial: "FW",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-105",
    name: "Ana Souza",
    role: "Product Designer",
    description:
      "UX research, prototyping, design ops. Runs usability tests and translates findings into Figma specs.",
    avatarInitial: "AS",
    weeklyCapacityPoints: 10,
  },
  {
    id: "emp-106",
    name: "Reuben Carter",
    role: "Mobile Engineer",
    description:
      "Native iOS (Swift, SwiftUI) and React Native. Familiar with App Store / Play release pipelines.",
    avatarInitial: "RC",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-107",
    name: "Nadia Aboud",
    role: "Backend Engineer",
    description:
      "Python, FastAPI, Postgres. Handles tricky data-modeling work and cross-service migrations.",
    avatarInitial: "NA",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-108",
    name: "Tristan Roy",
    role: "Full-stack Engineer",
    description:
      "TypeScript, Node, React. Comfortable bouncing between API endpoints and product UI, especially on flow-heavy features.",
    avatarInitial: "TR",
    weeklyCapacityPoints: 13,
  },
  {
    id: "emp-109",
    name: "Iris Wang",
    role: "QA Engineer",
    description:
      "Automation specialist (Playwright, load testing). Builds resilient CI test pipelines and catches flaky tests fast.",
    avatarInitial: "IW",
    weeklyCapacityPoints: 10,
  },
  {
    id: "emp-110",
    name: "Oluwa Adebayo",
    role: "ML Engineer",
    description:
      "Recommendation systems, embeddings, retrieval. Ships ML services with proper feature stores and monitoring.",
    avatarInitial: "OA",
    weeklyCapacityPoints: 10,
  },
  {
    id: "emp-111",
    name: "Selene Ramos",
    role: "Security Engineer",
    description:
      "SAST/DAST, threat modeling, secrets review. Reviews architecture for blast-radius and least-privilege issues.",
    avatarInitial: "SR2",
    weeklyCapacityPoints: 10,
  },
];

export const projectMemberships: ProjectMembership[] = [
  // Project 1 — SmartPM
  { projectId: "p-1", employeeId: "tm-1" },
  { projectId: "p-1", employeeId: "tm-2" },
  { projectId: "p-1", employeeId: "tm-3" },
  { projectId: "p-1", employeeId: "tm-4" },
  { projectId: "p-1", employeeId: "tm-5" },
  { projectId: "p-1", employeeId: "tm-6" },
  { projectId: "p-1", employeeId: "emp-108" }, // Tristan, helps with full-stack
  // Project 2 — Customer Portal v2
  { projectId: "p-2", employeeId: "p2-tm-1" },
  { projectId: "p-2", employeeId: "p2-tm-2" },
  { projectId: "p-2", employeeId: "p2-tm-3" },
  { projectId: "p-2", employeeId: "p2-tm-4" },
  { projectId: "p-2", employeeId: "p2-tm-5" },
  { projectId: "p-2", employeeId: "emp-101" }, // Maya, joins as frontend
  // Project 3 — HR Platform
  { projectId: "p-3", employeeId: "emp-105" }, // Ana — designer
  { projectId: "p-3", employeeId: "emp-107" }, // Nadia — backend
  { projectId: "p-3", employeeId: "emp-108" }, // Tristan — full-stack (shared)
  { projectId: "p-3", employeeId: "emp-101" }, // Maya — frontend (shared)
  { projectId: "p-3", employeeId: "emp-102" }, // Karim — backend
  { projectId: "p-3", employeeId: "emp-109" }, // Iris — QA
  // Project 4 — Data Lake Migration
  { projectId: "p-4", employeeId: "emp-103" }, // Yuki — DevOps
  { projectId: "p-4", employeeId: "emp-104" }, // Felix — Data Engineer
  { projectId: "p-4", employeeId: "emp-107" }, // Nadia — backend (shared with p-3)
  { projectId: "p-4", employeeId: "emp-110" }, // Oluwa — ML
  { projectId: "p-4", employeeId: "emp-111" }, // Selene — Security
];

export const sprints: Sprint[] = [
  // Project 1 — SmartPM
  { id: "sp-1", projectId: "p-1", name: "Sprint 1 — Auth & Foundations", startDate: "2026-04-15", endDate: "2026-04-28", status: "closed", plannedPoints: 34 },
  { id: "sp-2", projectId: "p-1", name: "Sprint 2 — Core PM Surface", startDate: "2026-04-29", endDate: "2026-05-19", status: "active", plannedPoints: 42 },
  { id: "sp-3", projectId: "p-1", name: "Sprint 3 — Integrations & Polish", startDate: "2026-05-20", endDate: "2026-06-02", status: "future", plannedPoints: 30 },
  { id: "sp-4", projectId: "p-1", name: "Sprint 4 — Hardening & Launch", startDate: "2026-06-03", endDate: "2026-06-16", status: "future", plannedPoints: 26 },
  // Project 2 — Customer Portal v2
  { id: "p2-sp-1", projectId: "p-2", name: "Sprint 1 — Foundations", startDate: "2026-04-15", endDate: "2026-04-28", status: "closed", plannedPoints: 26 },
  { id: "p2-sp-2", projectId: "p-2", name: "Sprint 2 — Self-service Flows", startDate: "2026-04-29", endDate: "2026-05-19", status: "active", plannedPoints: 36 },
  { id: "p2-sp-3", projectId: "p-2", name: "Sprint 3 — AI Ticket Routing", startDate: "2026-05-20", endDate: "2026-06-02", status: "future", plannedPoints: 28 },
  { id: "p2-sp-4", projectId: "p-2", name: "Sprint 4 — Localization & SLAs", startDate: "2026-06-03", endDate: "2026-06-16", status: "future", plannedPoints: 24 },
  // Project 3 — HR Platform Modernization
  { id: "p3-sp-1", projectId: "p-3", name: "Sprint 1 — Onboarding Foundations", startDate: "2026-04-15", endDate: "2026-04-28", status: "closed", plannedPoints: 28 },
  { id: "p3-sp-2", projectId: "p-3", name: "Sprint 2 — Performance Reviews", startDate: "2026-04-29", endDate: "2026-05-19", status: "active", plannedPoints: 40 },
  { id: "p3-sp-3", projectId: "p-3", name: "Sprint 3 — Time-off & Calendar", startDate: "2026-05-20", endDate: "2026-06-02", status: "future", plannedPoints: 24 },
  { id: "p3-sp-4", projectId: "p-3", name: "Sprint 4 — People Reporting", startDate: "2026-06-03", endDate: "2026-06-16", status: "future", plannedPoints: 18 },
  // Project 4 — Data Lake Migration
  { id: "p4-sp-1", projectId: "p-4", name: "Sprint 1 — Lakehouse Foundations", startDate: "2026-04-15", endDate: "2026-04-28", status: "closed", plannedPoints: 30 },
  { id: "p4-sp-2", projectId: "p-4", name: "Sprint 2 — Ingest & Transform", startDate: "2026-04-29", endDate: "2026-05-19", status: "active", plannedPoints: 38 },
  { id: "p4-sp-3", projectId: "p-4", name: "Sprint 3 — Quality & Governance", startDate: "2026-05-20", endDate: "2026-06-02", status: "future", plannedPoints: 24 },
  { id: "p4-sp-4", projectId: "p-4", name: "Sprint 4 — Snowflake Decommission", startDate: "2026-06-03", endDate: "2026-06-16", status: "future", plannedPoints: 16 },
];

// Time-tracking conventions used below (for AI predictive analytics):
//   estimatedHours = initial estimate at task creation
//   trackedHours   = actual hours logged so far
// Per-assignee bias is intentional to give the AI signal:
//   tm-1 Emran: slightly under-estimates (under by ~10%)
//   tm-2 Priya: consistently over-runs estimates (over by ~25%)
//   tm-3 Marcus: accurate (±5%)
//   tm-4 Hana: accurate but often blocked → tracked < est while open
//   tm-5 Diego: faster than estimates (under by ~15%)
//   tm-6 Aisha: accurate on viz, over-runs on dense filter work
//   p2-tm-2 Owen: accurate
//   p2-tm-3 Mira: over-runs on stateful forms (over by ~20%)
//   p2-tm-4 Theo: large variance on ML work
const rawTasks: Task[] = [
  // ─────────── Project 1 — Sprint 1 (closed — all Done) ───────────
  { id: "t-101", projectId: "p-1", title: "Set up Next.js app shell", description: "Initialize the Next.js 16 project with App Router. Configure TypeScript strict mode, ESLint, and base page/layout structure.", status: "done", assigneeId: "tm-3", priority: "high", storyPoints: 3, dueDate: "2026-04-18", sprintId: "sp-1", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-18" },
  { id: "t-102", projectId: "p-1", title: "Implement JWT auth middleware", description: "Verify Bearer tokens on /api/* routes, attach user context to the request, return 401 on bad/expired tokens. Includes signature rotation support.", status: "done", assigneeId: "tm-1", priority: "critical", storyPoints: 5, dueDate: "2026-04-22", sprintId: "sp-1", estimatedHours: 14, trackedHours: 16, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-21" },
  { id: "t-103", projectId: "p-1", title: "Build login + signup pages", description: "Email/password forms with client-side validation. POSTs to /api/auth/{login,signup}, stores the returned JWT in an httpOnly cookie.", status: "done", assigneeId: "tm-2", priority: "high", storyPoints: 5, dueDate: "2026-04-23", sprintId: "sp-1", estimatedHours: 12, trackedHours: 16, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-23" },
  { id: "t-104", projectId: "p-1", title: "Database schema for users + sessions", description: "Postgres tables for users (id, email, hashed_password, created_at) and sessions (id, user_id, expires_at, revoked). Includes migrations and seed.", status: "done", assigneeId: "tm-1", priority: "high", storyPoints: 3, dueDate: "2026-04-20", sprintId: "sp-1", estimatedHours: 7, trackedHours: 8, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-19" },
  { id: "t-105", projectId: "p-1", title: "Password reset flow", description: "Forgot-password form sends a reset email via SendGrid. The reset link carries a signed token that expires in 1 hour.", status: "done", assigneeId: "tm-3", priority: "medium", storyPoints: 3, dueDate: "2026-04-25", sprintId: "sp-1", estimatedHours: 9, trackedHours: 11, createdAt: "2026-04-16", lastStatusChangeAt: "2026-04-26" },
  { id: "t-106", projectId: "p-1", title: "OAuth (Google) integration", description: "Google OAuth 2.0 sign-in. Callback creates or matches a user by email, issues a session JWT, and links the provider id to the user row.", status: "done", assigneeId: "tm-1", priority: "medium", storyPoints: 5, dueDate: "2026-04-27", sprintId: "sp-1", estimatedHours: 12, trackedHours: 18, createdAt: "2026-04-17", lastStatusChangeAt: "2026-04-27" },
  { id: "t-107", projectId: "p-1", title: "Initial landing page", description: "Static marketing page with hero, three feature blocks, and a primary CTA. No CMS — copy and images live in the repo.", status: "done", assigneeId: "tm-2", priority: "low", storyPoints: 2, dueDate: "2026-04-22", sprintId: "sp-1", estimatedHours: 5, trackedHours: 6, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-22" },
  { id: "t-108", projectId: "p-1", title: "Mobile auth wrapper (iOS/Android)", description: "React Native module that stores JWT in iOS Keychain / Android KeyStore and refreshes silently. Exposes useAuth() and useToken() hooks.", status: "done", assigneeId: "tm-4", priority: "medium", storyPoints: 5, dueDate: "2026-04-28", sprintId: "sp-1", estimatedHours: 14, trackedHours: 15, createdAt: "2026-04-18", lastStatusChangeAt: "2026-04-28" },
  { id: "t-109", projectId: "p-1", title: "QA: auth happy + error paths", description: "Cypress suite covering signup, login, expired token, wrong password, locked account, and OAuth callback. 12 scenarios total.", status: "done", assigneeId: "tm-5", priority: "high", storyPoints: 2, dueDate: "2026-04-28", sprintId: "sp-1", estimatedHours: 6, trackedHours: 4, createdAt: "2026-04-22", lastStatusChangeAt: "2026-04-28" },
  { id: "t-110", projectId: "p-1", title: "Email templates for verification", description: "MJML templates for verify-email and welcome. Render to inline-styled HTML with a plain-text fallback.", status: "done", assigneeId: "tm-6", priority: "low", storyPoints: 1, dueDate: "2026-04-25", sprintId: "sp-1", estimatedHours: 3, trackedHours: 3, createdAt: "2026-04-19", lastStatusChangeAt: "2026-04-24" },

  // ─────────── Project 1 — Sprint 2 (active) ───────────
  { id: "t-201", projectId: "p-1", title: "Audit log for sensitive actions", description: "Append-only audit table logging actor, action, resource, IP, and timestamp for assignment changes, deletes, and permission edits. Read-only admin view comes later.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 5, dueDate: "2026-05-18", sprintId: "sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-04-29", lastStatusChangeAt: "2026-04-29" },
  { id: "t-202", projectId: "p-1", title: "Rate limiting on public endpoints", description: "Per-IP and per-token sliding-window rate limits on /api/*. Returns 429 with Retry-After header. In-memory store for v1; Redis later.", status: "backlog", assigneeId: "tm-1", priority: "high", storyPoints: 3, dueDate: "2026-05-17", sprintId: "sp-2", estimatedHours: 8, trackedHours: 0, createdAt: "2026-04-29", lastStatusChangeAt: "2026-04-29", dependsOn: ["t-209"] },
  { id: "t-203", projectId: "p-1", title: "Build Sprint Board Kanban view", description: "Five-column board (backlog → done) showing cards for the active sprint. Cards display title, assignee, priority, and points. Drag handled in a separate task.", status: "todo", assigneeId: "tm-2", priority: "critical", storyPoints: 8, dueDate: "2026-05-15", sprintId: "sp-2", estimatedHours: 22, trackedHours: 4, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-02" },
  { id: "t-204", projectId: "p-1", title: "Task detail modal", description: "Modal opens from a card click. Shows full title/description, status, assignee, dependencies, and blockers, with inline edits for status and assignee.", status: "todo", assigneeId: null, priority: "high", storyPoints: 3, dueDate: "2026-05-16", sprintId: "sp-2", estimatedHours: 9, trackedHours: 0, createdAt: "2026-04-30", lastStatusChangeAt: "2026-04-30", dependsOn: ["t-203"] },
  { id: "t-205", projectId: "p-1", title: "Filter bar (assignee, priority, risk)", description: "Sticky filter bar above the board with multi-select for assignee, priority, and risk level. State synced to URL params for shareable views.", status: "todo", assigneeId: "tm-6", priority: "medium", storyPoints: 3, dueDate: "2026-05-17", sprintId: "sp-2", estimatedHours: 9, trackedHours: 2, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-01", dependsOn: ["t-203"] },
  { id: "t-206", projectId: "p-1", title: "Analytics dashboard charts (Recharts)", description: "Velocity bar chart, burndown area chart, risk-distribution donut, and team-workload bars. Data pulled from /api/tasks?summary=true.", status: "in_progress", assigneeId: "tm-6", priority: "high", storyPoints: 5, dueDate: "2026-05-15", sprintId: "sp-2", estimatedHours: 14, trackedHours: 11, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-08", dependsOn: ["t-209"] },
  { id: "t-207", projectId: "p-1", title: "Drag-and-drop with @dnd-kit", description: "Wire @dnd-kit/sortable to the board so cards can be dragged between status columns. Optimistically updates status; rolls back on API error.", status: "in_progress", assigneeId: "tm-3", priority: "critical", storyPoints: 5, dueDate: "2026-05-12", sprintId: "sp-2", estimatedHours: 14, trackedHours: 20, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-05" },
  { id: "t-208", projectId: "p-1", title: "Push notifications for mobile blockers", description: "iOS APNs + Android FCM push when a task assigned to the user is marked blocked. Payload includes a deep link back to the task.", status: "in_progress", assigneeId: "tm-4", priority: "medium", storyPoints: 5, dueDate: "2026-05-18", sprintId: "sp-2", estimatedHours: 14, trackedHours: 7, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-09" },
  { id: "t-209", projectId: "p-1", title: "API: GET /tasks with filters", description: "REST endpoint returning paged tasks filtered by sprintId, assigneeId, status, and priority. Supports sort by dueDate or priority.", status: "in_review", assigneeId: "tm-1", priority: "high", storyPoints: 3, dueDate: "2026-05-14", sprintId: "sp-2", estimatedHours: 8, trackedHours: 9, createdAt: "2026-05-02", lastStatusChangeAt: "2026-05-11" },
  { id: "t-210", projectId: "p-1", title: "Sprint selector dropdown", description: "Header dropdown listing all sprints with active/closed/future badges. Changing selection updates the board context globally.", status: "in_review", assigneeId: "tm-2", priority: "low", storyPoints: 2, dueDate: "2026-05-13", sprintId: "sp-2", estimatedHours: 5, trackedHours: 7, createdAt: "2026-05-04", lastStatusChangeAt: "2026-05-12" },
  { id: "t-211", projectId: "p-1", title: "QA: drag-drop edge cases", description: "Verify drag from collapsed columns, drag mid-API-failure, keyboard accessibility for drag, and undo on optimistic rollback.", status: "in_review", assigneeId: "tm-5", priority: "medium", storyPoints: 2, dueDate: "2026-05-14", sprintId: "sp-2", estimatedHours: 6, trackedHours: 5, createdAt: "2026-05-06", lastStatusChangeAt: "2026-05-12", dependsOn: ["t-207"] },
  { id: "t-212", projectId: "p-1", title: "Project scaffolding + Tailwind config", description: "Repo tooling: eslint, prettier, tailwind config with brand tokens, prettier-plugin-tailwindcss, and CI workflow.", status: "done", assigneeId: "tm-3", priority: "high", storyPoints: 2, dueDate: "2026-05-01", sprintId: "sp-2", estimatedHours: 5, trackedHours: 5, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-01" },
  { id: "t-213", projectId: "p-1", title: "Shadcn UI component setup", description: "Install shadcn primitives (Button, Card, Dialog, Tooltip, Avatar, Select). Wire color tokens to brand variables.", status: "done", assigneeId: "tm-2", priority: "medium", storyPoints: 2, dueDate: "2026-05-03", sprintId: "sp-2", estimatedHours: 5, trackedHours: 7, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-03" },
  { id: "t-214", projectId: "p-1", title: "Domain types + dummy data", description: "Define Task / Sprint / TeamMember / Blocker types. Seed realistic data for two demo projects with varied statuses.", status: "done", assigneeId: "tm-3", priority: "high", storyPoints: 3, dueDate: "2026-05-05", sprintId: "sp-2", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-05" },
  { id: "t-215", projectId: "p-1", title: "Layout shell (sidebar + header)", description: "App chrome with collapsible sidebar (Board / Team / Analytics) and a top header showing the project switcher and AI Assistant toggle.", status: "done", assigneeId: "tm-6", priority: "medium", storyPoints: 2, dueDate: "2026-05-07", sprintId: "sp-2", estimatedHours: 5, trackedHours: 5, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-07" },

  // ─────────── Project 1 — Sprint 3 (future) ───────────
  { id: "t-301", projectId: "p-1", title: "ClickUp sync integration", description: "Two-way sync with ClickUp: pull tasks via webhook, push status changes back. Field mapping defined in a per-project config.", status: "backlog", assigneeId: null, priority: "high", storyPoints: 8, dueDate: "2026-05-28", sprintId: "sp-3", estimatedHours: 24, trackedHours: 0, createdAt: "2026-05-08", lastStatusChangeAt: "2026-05-08" },
  { id: "t-302", projectId: "p-1", title: "GitHub PR-to-task linking", description: "Parse PR titles/bodies for `closes #task-id`. Move task to in-review when PR opens, to done on merge.", status: "backlog", assigneeId: "tm-1", priority: "medium", storyPoints: 5, dueDate: "2026-05-30", sprintId: "sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-08", lastStatusChangeAt: "2026-05-08", dependsOn: ["t-301"] },
  { id: "t-303", projectId: "p-1", title: "Slack notification webhooks", description: "Outbound webhook to a Slack channel on task assignment, blocker creation, and sprint completion. Configurable per project.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 5, dueDate: "2026-06-01", sprintId: "sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-09", lastStatusChangeAt: "2026-05-09", dependsOn: ["t-301"] },
  { id: "t-304", projectId: "p-1", title: "Demo dataset polish + readme", description: "Polish seeded names and descriptions. Write README covering setup, env vars, and the AI tool architecture.", status: "todo", assigneeId: "tm-3", priority: "low", storyPoints: 2, dueDate: "2026-06-02", sprintId: "sp-3", estimatedHours: 5, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "t-305", projectId: "p-1", title: "Mobile responsive pass", description: "Audit board, analytics, and team pages on iPhone and Android viewports. Fix overflow, switch sidebar to drawer below md.", status: "todo", assigneeId: "tm-4", priority: "medium", storyPoints: 3, dueDate: "2026-06-02", sprintId: "sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10", dependsOn: ["t-203"] },

  // ─────────── Project 2 — Sprint 1 (closed) ───────────
  { id: "p2-t-101", projectId: "p-2", title: "Design system audit + tokens", description: "Inventory legacy portal styles. Define design tokens for color, spacing, typography. Export as CSS variables and a Figma library.", status: "done", assigneeId: "p2-tm-1", priority: "high", storyPoints: 5, dueDate: "2026-04-20", sprintId: "p2-sp-1", estimatedHours: 12, trackedHours: 13, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-19" },
  { id: "p2-t-102", projectId: "p-2", title: "GraphQL gateway scaffolding", description: "Apollo Server with schema federation. Wires the portal frontend to the legacy ticketing service via a stable GraphQL API.", status: "done", assigneeId: "p2-tm-2", priority: "critical", storyPoints: 8, dueDate: "2026-04-25", sprintId: "p2-sp-1", estimatedHours: 22, trackedHours: 23, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-24" },
  { id: "p2-t-103", projectId: "p-2", title: "Auth + RBAC roles for customers/agents", description: "Three roles: customer, agent, admin. Permissions enforced at GraphQL resolver level via an @auth directive.", status: "done", assigneeId: "p2-tm-2", priority: "high", storyPoints: 5, dueDate: "2026-04-28", sprintId: "p2-sp-1", estimatedHours: 14, trackedHours: 15, createdAt: "2026-04-16", lastStatusChangeAt: "2026-04-27" },
  { id: "p2-t-104", projectId: "p-2", title: "Portal shell + navigation", description: "App layout with top nav (tickets, knowledge, account) and a responsive sidebar on the agent view. Role-aware visibility.", status: "done", assigneeId: "p2-tm-3", priority: "medium", storyPoints: 3, dueDate: "2026-04-26", sprintId: "p2-sp-1", estimatedHours: 8, trackedHours: 11, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-25" },
  { id: "p2-t-105", projectId: "p-2", title: "QA: smoke tests for legacy parity", description: "Playwright suite verifying customer login, ticket create/view, and agent reply still work end-to-end against the new gateway.", status: "done", assigneeId: "p2-tm-5", priority: "medium", storyPoints: 3, dueDate: "2026-04-28", sprintId: "p2-sp-1", estimatedHours: 9, trackedHours: 7, createdAt: "2026-04-22", lastStatusChangeAt: "2026-04-28" },

  // ─────────── Project 2 — Sprint 2 (active) ───────────
  { id: "p2-t-201", projectId: "p-2", title: "Ticket intake form (multi-step)", description: "Three-step intake (issue type → details → attachments). Client-side validation with inline errors. Resumes from sessionStorage on reload.", status: "in_progress", assigneeId: "p2-tm-3", priority: "critical", storyPoints: 8, dueDate: "2026-05-15", sprintId: "p2-sp-2", estimatedHours: 22, trackedHours: 26, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-07" },
  { id: "p2-t-202", projectId: "p-2", title: "File upload with virus scan hook", description: "Drag-and-drop uploader (10MB cap, 5 files). POSTs to /api/uploads, where a virus-scan webhook gates final persistence.", status: "in_progress", assigneeId: "p2-tm-2", priority: "high", storyPoints: 5, dueDate: "2026-05-16", sprintId: "p2-sp-2", estimatedHours: 14, trackedHours: 12, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-06" },
  { id: "p2-t-203", projectId: "p-2", title: "Customer ticket history page", description: "Paginated list of the user's tickets with status badge, last update, and unread count. Detail click opens the ticket view.", status: "todo", assigneeId: "p2-tm-3", priority: "high", storyPoints: 5, dueDate: "2026-05-17", sprintId: "p2-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-01", dependsOn: ["p2-t-201"] },
  { id: "p2-t-204", projectId: "p-2", title: "Empty + error states for portal", description: "Empty-state illustrations and copy for no tickets, search no-results, and access denied. Generic error boundary with retry.", status: "todo", assigneeId: "p2-tm-1", priority: "medium", storyPoints: 3, dueDate: "2026-05-18", sprintId: "p2-sp-2", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-01" },
  { id: "p2-t-205", projectId: "p-2", title: "Agent reply composer (rich text)", description: "Tiptap-based editor with formatting, inline images, and canned-response insertion. Sends via the ticket-reply mutation.", status: "in_review", assigneeId: "p2-tm-3", priority: "medium", storyPoints: 5, dueDate: "2026-05-14", sprintId: "p2-sp-2", estimatedHours: 14, trackedHours: 17, createdAt: "2026-05-02", lastStatusChangeAt: "2026-05-12" },
  { id: "p2-t-206", projectId: "p-2", title: "Notification preferences API", description: "REST endpoints (GET/PUT /me/preferences) for email/SMS/push toggles per event type. Persisted on the user row.", status: "in_review", assigneeId: "p2-tm-2", priority: "low", storyPoints: 3, dueDate: "2026-05-13", sprintId: "p2-sp-2", estimatedHours: 8, trackedHours: 8, createdAt: "2026-05-03", lastStatusChangeAt: "2026-05-11" },
  { id: "p2-t-207", projectId: "p-2", title: "QA: a11y audit on intake flow", description: "axe-core scan of the multi-step intake. Manual screen-reader pass with VoiceOver and NVDA. Fix any AA failures before sign-off.", status: "in_review", assigneeId: "p2-tm-5", priority: "high", storyPoints: 3, dueDate: "2026-05-15", sprintId: "p2-sp-2", estimatedHours: 9, trackedHours: 7, createdAt: "2026-05-05", lastStatusChangeAt: "2026-05-12", dependsOn: ["p2-t-201"] },
  { id: "p2-t-208", projectId: "p-2", title: "Customer onboarding tour", description: "Three-stop tour using react-joyride for first-time visitors. Dismissal tracked in user prefs so it doesn't reappear.", status: "backlog", assigneeId: null, priority: "low", storyPoints: 3, dueDate: "2026-05-19", sprintId: "p2-sp-2", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-08", lastStatusChangeAt: "2026-05-08" },
  { id: "p2-t-209", projectId: "p-2", title: "Visual regression baseline", description: "Capture Percy snapshots for key portal pages on Chrome, Safari, Firefox. Wire CI to fail on diffs above 0.1%.", status: "done", assigneeId: "p2-tm-5", priority: "medium", storyPoints: 2, dueDate: "2026-05-02", sprintId: "p2-sp-2", estimatedHours: 5, trackedHours: 4, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-02" },
  { id: "p2-t-210", projectId: "p-2", title: "Style guide page (Storybook)", description: "Storybook with stories for every design-system component. Deployed to GitHub Pages so designers can review without a local setup.", status: "done", assigneeId: "p2-tm-1", priority: "medium", storyPoints: 3, dueDate: "2026-05-06", sprintId: "p2-sp-2", estimatedHours: 8, trackedHours: 9, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-06" },

  // ─────────── Project 2 — Sprint 3 (future) ───────────
  { id: "p2-t-301", projectId: "p-2", title: "NLP classifier for ticket intent", description: "Fine-tune a small classifier (DistilBERT or similar) on labeled ticket history to predict intent: billing, technical, account, other.", status: "backlog", assigneeId: "p2-tm-4", priority: "critical", storyPoints: 8, dueDate: "2026-05-30", sprintId: "p2-sp-3", estimatedHours: 28, trackedHours: 0, createdAt: "2026-05-09", lastStatusChangeAt: "2026-05-09" },
  { id: "p2-t-302", projectId: "p-2", title: "Auto-assign ticket to team queue", description: "Use the intent classifier to route new tickets to the matching team queue. Falls back to the general queue on low confidence.", status: "backlog", assigneeId: null, priority: "high", storyPoints: 5, dueDate: "2026-06-01", sprintId: "p2-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-09", lastStatusChangeAt: "2026-05-09", dependsOn: ["p2-t-301"] },
  { id: "p2-t-303", projectId: "p-2", title: "AI suggested response (draft only)", description: "Generate a draft reply for agents from ticket text + intent. Shown as a suggestion inside the composer — never auto-sent.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 5, dueDate: "2026-06-02", sprintId: "p2-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10", dependsOn: ["p2-t-301"] },

  // ─────────── Project 1 — Sprint 4 (future) ───────────
  { id: "t-401", projectId: "p-1", title: "Sentry error reporting integration", description: "Wire @sentry/nextjs into web + API. Tag releases via build SHA; sample errors to 25% on prod, 100% on staging.", status: "backlog", assigneeId: "tm-3", priority: "medium", storyPoints: 3, dueDate: "2026-06-09", sprintId: "sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "t-402", projectId: "p-1", title: "AI assistant telemetry", description: "Track tool-call success/failure rates and confirmation acceptance per project. Surface a small admin chart.", status: "backlog", assigneeId: "tm-6", priority: "medium", storyPoints: 5, dueDate: "2026-06-12", sprintId: "sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "t-403", projectId: "p-1", title: "Onboarding tour for first-time users", description: "Three-step product tour using react-joyride covering board, chat, and analytics. Dismiss persists per user.", status: "backlog", assigneeId: null, priority: "low", storyPoints: 3, dueDate: "2026-06-14", sprintId: "sp-4", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "t-404", projectId: "p-1", title: "Pricing + plans page", description: "Marketing pricing page with three tiers and feature matrix. Static, in-repo content.", status: "backlog", assigneeId: "emp-108", priority: "low", storyPoints: 3, dueDate: "2026-06-15", sprintId: "sp-4", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "t-405", projectId: "p-1", title: "QA: launch-readiness sweep", description: "End-to-end smoke across all flows on Chrome, Safari, Firefox + mobile viewports. Block release on any blocker-priority bug.", status: "backlog", assigneeId: "tm-5", priority: "high", storyPoints: 5, dueDate: "2026-06-16", sprintId: "sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "t-406", projectId: "p-1", title: "Multi-tenant project scoping audit", description: "Verify every API endpoint and mutation respects projectId scoping. Add automated test covering cross-project leaks.", status: "backlog", assigneeId: "tm-1", priority: "high", storyPoints: 5, dueDate: "2026-06-13", sprintId: "sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },

  // ─────────── Project 2 — Sprint 4 (future) ───────────
  { id: "p2-t-401", projectId: "p-2", title: "i18n: portal in English + Spanish", description: "Wrap copy in i18next, add Spanish locale. Locale switch in header; per-user preference persisted.", status: "backlog", assigneeId: "p2-tm-3", priority: "high", storyPoints: 8, dueDate: "2026-06-12", sprintId: "p2-sp-4", estimatedHours: 22, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p2-t-402", projectId: "p-2", title: "Post-resolve satisfaction survey", description: "Short CSAT widget when an agent marks a ticket resolved. 1–5 stars + optional comment, anonymous to the agent.", status: "backlog", assigneeId: "emp-101", priority: "medium", storyPoints: 3, dueDate: "2026-06-09", sprintId: "p2-sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p2-t-403", projectId: "p-2", title: "Sentiment tagging on inbound tickets", description: "Run incoming ticket text through a lightweight sentiment model; tag negative tickets for triage priority.", status: "backlog", assigneeId: "p2-tm-4", priority: "medium", storyPoints: 5, dueDate: "2026-06-15", sprintId: "p2-sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p2-t-404", projectId: "p-2", title: "SLA breach escalation", description: "When ticket nears or breaches SLA, alert the team lead and rotate priority. Configurable thresholds per queue.", status: "backlog", assigneeId: "p2-tm-2", priority: "high", storyPoints: 5, dueDate: "2026-06-14", sprintId: "p2-sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p2-t-405", projectId: "p-2", title: "QA: localization regression", description: "Visual + functional regression across Spanish locale. Cover RTL prep (Arabic) even if not shipping yet.", status: "backlog", assigneeId: "p2-tm-5", priority: "medium", storyPoints: 3, dueDate: "2026-06-16", sprintId: "p2-sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12", dependsOn: ["p2-t-401"] },

  // ─────────── Project 3 — Sprint 1 (closed, all done) ───────────
  { id: "p3-t-101", projectId: "p-3", title: "New-hire welcome flow", description: "Multi-step welcome experience for new employees. Captures preferred name, emergency contact, and team-channel intros.", status: "done", assigneeId: "emp-105", priority: "high", storyPoints: 5, dueDate: "2026-04-22", sprintId: "p3-sp-1", estimatedHours: 14, trackedHours: 15, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-22" },
  { id: "p3-t-102", projectId: "p-3", title: "Document upload + e-sign integration", description: "Integrate DocuSign for offer letters, NDAs, and tax forms. Status webhook updates employee record on completion.", status: "done", assigneeId: "emp-107", priority: "critical", storyPoints: 5, dueDate: "2026-04-24", sprintId: "p3-sp-1", estimatedHours: 14, trackedHours: 13, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-23" },
  { id: "p3-t-103", projectId: "p-3", title: "Employee profile schema (Postgres)", description: "Schema for employees, employment_periods, and emergency_contacts with audit columns. Migrations + seed.", status: "done", assigneeId: "emp-102", priority: "high", storyPoints: 3, dueDate: "2026-04-20", sprintId: "p3-sp-1", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-19" },
  { id: "p3-t-104", projectId: "p-3", title: "SSO via Okta", description: "SAML SSO with Okta. JIT-provision new users on first login; map Okta groups to platform roles.", status: "done", assigneeId: "emp-102", priority: "critical", storyPoints: 5, dueDate: "2026-04-25", sprintId: "p3-sp-1", estimatedHours: 14, trackedHours: 16, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-25" },
  { id: "p3-t-105", projectId: "p-3", title: "Email templates: welcome / day-1 / week-1", description: "MJML templates triggered by employee lifecycle events. Plain-text fallback and unsubscribe footer.", status: "done", assigneeId: "emp-105", priority: "low", storyPoints: 2, dueDate: "2026-04-21", sprintId: "p3-sp-1", estimatedHours: 5, trackedHours: 4, createdAt: "2026-04-17", lastStatusChangeAt: "2026-04-21" },
  { id: "p3-t-106", projectId: "p-3", title: "Slack: new-hire announcements", description: "Auto-post a welcome message to a configurable channel on day 1, with profile photo and short bio.", status: "done", assigneeId: "emp-108", priority: "medium", storyPoints: 2, dueDate: "2026-04-26", sprintId: "p3-sp-1", estimatedHours: 5, trackedHours: 5, createdAt: "2026-04-18", lastStatusChangeAt: "2026-04-26" },
  { id: "p3-t-107", projectId: "p-3", title: "Admin dashboard scaffolding", description: "Internal admin route guarded by Okta admin group. Empty shell with placeholders for upcoming reports.", status: "done", assigneeId: "emp-101", priority: "medium", storyPoints: 3, dueDate: "2026-04-27", sprintId: "p3-sp-1", estimatedHours: 8, trackedHours: 9, createdAt: "2026-04-16", lastStatusChangeAt: "2026-04-27" },
  { id: "p3-t-108", projectId: "p-3", title: "QA: onboarding happy path", description: "Playwright suite covering invite → SSO → profile complete → first document signed. 8 scenarios.", status: "done", assigneeId: "emp-109", priority: "high", storyPoints: 3, dueDate: "2026-04-28", sprintId: "p3-sp-1", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-22", lastStatusChangeAt: "2026-04-28" },

  // ─────────── Project 3 — Sprint 2 (active) ───────────
  { id: "p3-t-201", projectId: "p-3", title: "360-feedback form (multi-step)", description: "Three-step review form: self-evaluation, peer feedback, manager feedback. Autosaves to draft every 30s.", status: "in_progress", assigneeId: "emp-101", priority: "critical", storyPoints: 8, dueDate: "2026-05-15", sprintId: "p3-sp-2", estimatedHours: 22, trackedHours: 18, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-08" },
  { id: "p3-t-202", projectId: "p-3", title: "Manager dashboard for review cycles", description: "Per-cycle view of team progress: who's submitted, who's outstanding, due dates, blockers. Filterable.", status: "in_progress", assigneeId: "emp-108", priority: "high", storyPoints: 5, dueDate: "2026-05-16", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 11, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-09" },
  { id: "p3-t-203", projectId: "p-3", title: "Self-evaluation editor with autosave", description: "Rich-text editor (Tiptap) with autosave to draft. Inline guidance prompts from manager when configured.", status: "in_progress", assigneeId: "emp-101", priority: "high", storyPoints: 5, dueDate: "2026-05-15", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 10, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-07", dependsOn: ["p3-t-201"] },
  { id: "p3-t-204", projectId: "p-3", title: "Reviewer assignment workflow", description: "Manager picks 3–5 reviewers per employee. System sends invites, tracks RSVPs, allows decline + reassign.", status: "todo", assigneeId: "emp-108", priority: "high", storyPoints: 5, dueDate: "2026-05-17", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 2, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-02" },
  { id: "p3-t-205", projectId: "p-3", title: "Anonymous peer-feedback aggregation", description: "Aggregate peer comments while keeping individual responses anonymous to the subject. 3+ responses required to surface.", status: "todo", assigneeId: "emp-107", priority: "high", storyPoints: 5, dueDate: "2026-05-18", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-01" },
  { id: "p3-t-206", projectId: "p-3", title: "Cycle scheduling + reminders", description: "Configure review-cycle windows. Email + Slack reminders at T-7, T-3, T-1, and overdue.", status: "todo", assigneeId: "emp-107", priority: "medium", storyPoints: 3, dueDate: "2026-05-18", sprintId: "p3-sp-2", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-01" },
  { id: "p3-t-207", projectId: "p-3", title: "API: GET /reviews with filters", description: "Read endpoint returning paged reviews filtered by cycleId, reviewerId, status. Supports per-team scoping.", status: "in_review", assigneeId: "emp-102", priority: "high", storyPoints: 3, dueDate: "2026-05-13", sprintId: "p3-sp-2", estimatedHours: 8, trackedHours: 9, createdAt: "2026-05-02", lastStatusChangeAt: "2026-05-11" },
  { id: "p3-t-208", projectId: "p-3", title: "Notification preferences for managers", description: "Toggle email/Slack notifications per event type. Persisted on the user row.", status: "in_review", assigneeId: "emp-102", priority: "low", storyPoints: 2, dueDate: "2026-05-13", sprintId: "p3-sp-2", estimatedHours: 5, trackedHours: 5, createdAt: "2026-05-04", lastStatusChangeAt: "2026-05-12" },
  { id: "p3-t-209", projectId: "p-3", title: "Export review packet to PDF", description: "Generate a PDF combining self-evaluation, peer feedback, and manager comments. Layout via @react-pdf/renderer.", status: "todo", assigneeId: "emp-101", priority: "medium", storyPoints: 5, dueDate: "2026-05-19", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-05", lastStatusChangeAt: "2026-05-05" },
  { id: "p3-t-210", projectId: "p-3", title: "Calibration meeting prep view", description: "Pre-calibration view ranking everyone on configurable axes. Drag to reorder, comments inline.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 5, dueDate: "2026-05-19", sprintId: "p3-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-06", lastStatusChangeAt: "2026-05-06" },
  { id: "p3-t-211", projectId: "p-3", title: "QA: review-cycle edge cases", description: "Test reviewer decline mid-cycle, manager rotation, late submissions, and PDF export with missing sections.", status: "in_review", assigneeId: "emp-109", priority: "medium", storyPoints: 3, dueDate: "2026-05-15", sprintId: "p3-sp-2", estimatedHours: 9, trackedHours: 8, createdAt: "2026-05-06", lastStatusChangeAt: "2026-05-13", dependsOn: ["p3-t-201"] },
  { id: "p3-t-212", projectId: "p-3", title: "Empty + error states for review pages", description: "Empty states for no active cycle, no peers assigned, and submission deadlines passed. Generic error boundary with retry.", status: "in_progress", assigneeId: "emp-105", priority: "medium", storyPoints: 3, dueDate: "2026-05-16", sprintId: "p3-sp-2", estimatedHours: 8, trackedHours: 5, createdAt: "2026-05-04", lastStatusChangeAt: "2026-05-10" },

  // ─────────── Project 3 — Sprint 3 (future) ───────────
  { id: "p3-t-301", projectId: "p-3", title: "Time-off request form", description: "Date-range picker with day/half-day granularity. Shows balance impact before submit; routes to manager queue.", status: "backlog", assigneeId: "emp-101", priority: "high", storyPoints: 5, dueDate: "2026-05-26", sprintId: "p3-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p3-t-302", projectId: "p-3", title: "Manager approval queue", description: "Inbox of pending time-off requests with one-click approve/deny + reason. Auto-decline after 7 days inactivity.", status: "backlog", assigneeId: "emp-108", priority: "high", storyPoints: 3, dueDate: "2026-05-28", sprintId: "p3-sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10", dependsOn: ["p3-t-301"] },
  { id: "p3-t-303", projectId: "p-3", title: "Calendar integration (Google + Outlook)", description: "Sync approved time-off to user's primary calendar via OAuth. Mark as 'Out of office' with auto-reply hint.", status: "backlog", assigneeId: "emp-107", priority: "medium", storyPoints: 5, dueDate: "2026-05-30", sprintId: "p3-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p3-t-304", projectId: "p-3", title: "Balance accrual rules engine", description: "Configurable accrual rates per role/region. Run a nightly job to add accrued days, cap at policy maximum.", status: "backlog", assigneeId: "emp-102", priority: "high", storyPoints: 5, dueDate: "2026-06-01", sprintId: "p3-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p3-t-305", projectId: "p-3", title: "Public team-availability calendar", description: "Read-only calendar showing who's OOO across the team. Excludes private leave types per policy.", status: "backlog", assigneeId: "emp-101", priority: "low", storyPoints: 3, dueDate: "2026-06-02", sprintId: "p3-sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p3-t-306", projectId: "p-3", title: "Notification on approval", description: "Email + Slack DM when a time-off request is approved or denied. Include reason if denied.", status: "backlog", assigneeId: null, priority: "low", storyPoints: 2, dueDate: "2026-05-29", sprintId: "p3-sp-3", estimatedHours: 5, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10", dependsOn: ["p3-t-302"] },

  // ─────────── Project 3 — Sprint 4 (future) ───────────
  { id: "p3-t-401", projectId: "p-3", title: "Reporting dashboard scaffolding", description: "People analytics route with chart placeholders: headcount, attrition, tenure distribution.", status: "backlog", assigneeId: "emp-101", priority: "medium", storyPoints: 3, dueDate: "2026-06-08", sprintId: "p3-sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p3-t-402", projectId: "p-3", title: "DEI metrics export", description: "Aggregate-only DEI report exportable as CSV. No individual identifiers; minimum bucket size of 5.", status: "backlog", assigneeId: "emp-107", priority: "medium", storyPoints: 5, dueDate: "2026-06-12", sprintId: "p3-sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p3-t-403", projectId: "p-3", title: "Tenure analytics", description: "Tenure distribution chart with quartiles, broken down by team. Hover shows median tenure per cohort.", status: "backlog", assigneeId: null, priority: "low", storyPoints: 3, dueDate: "2026-06-14", sprintId: "p3-sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12", dependsOn: ["p3-t-401"] },
  { id: "p3-t-404", projectId: "p-3", title: "Slack /report command", description: "Slash command in Slack returning a quick org snapshot: headcount, open roles, last week's hires.", status: "backlog", assigneeId: null, priority: "low", storyPoints: 3, dueDate: "2026-06-15", sprintId: "p3-sp-4", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },

  // ─────────── Project 4 — Sprint 1 (closed, all done) ───────────
  { id: "p4-t-101", projectId: "p-4", title: "Lakehouse storage layout (Iceberg)", description: "Define the Iceberg table layout for raw/staging/marts. Partitioning by ingest_date; manifests on S3.", status: "done", assigneeId: "emp-104", priority: "critical", storyPoints: 5, dueDate: "2026-04-21", sprintId: "p4-sp-1", estimatedHours: 14, trackedHours: 16, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-21" },
  { id: "p4-t-102", projectId: "p-4", title: "Source-system inventory + mapping", description: "Inventory the 12 production systems we pull from. Document table-to-target lakehouse mapping for each.", status: "done", assigneeId: "emp-104", priority: "high", storyPoints: 3, dueDate: "2026-04-19", sprintId: "p4-sp-1", estimatedHours: 8, trackedHours: 8, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-19" },
  { id: "p4-t-103", projectId: "p-4", title: "Airflow scheduler setup", description: "Deploy Airflow on EKS. Wire to Slack alerting on DAG failures. Sensor-pattern DAGs for source data arrival.", status: "done", assigneeId: "emp-103", priority: "high", storyPoints: 5, dueDate: "2026-04-24", sprintId: "p4-sp-1", estimatedHours: 14, trackedHours: 13, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-24" },
  { id: "p4-t-104", projectId: "p-4", title: "IAM roles for analyst access", description: "Read-only Iceberg + Athena access for analysts, time-boxed write access for engineers. Audit-logged.", status: "done", assigneeId: "emp-111", priority: "high", storyPoints: 3, dueDate: "2026-04-25", sprintId: "p4-sp-1", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-17", lastStatusChangeAt: "2026-04-25" },
  { id: "p4-t-105", projectId: "p-4", title: "CDC pipeline from Postgres → lake", description: "Use Debezium to stream Postgres change events into the staging layer. Idempotent merges, ordering preserved.", status: "done", assigneeId: "emp-107", priority: "critical", storyPoints: 8, dueDate: "2026-04-26", sprintId: "p4-sp-1", estimatedHours: 22, trackedHours: 24, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-26" },
  { id: "p4-t-106", projectId: "p-4", title: "Snowflake → lake parity benchmarks", description: "Run identical queries on Snowflake and the lakehouse; compare row counts, totals, and key cardinalities.", status: "done", assigneeId: "emp-104", priority: "high", storyPoints: 3, dueDate: "2026-04-27", sprintId: "p4-sp-1", estimatedHours: 8, trackedHours: 9, createdAt: "2026-04-18", lastStatusChangeAt: "2026-04-27" },
  { id: "p4-t-107", projectId: "p-4", title: "dbt project scaffold", description: "Initialize the dbt project: profiles, macros, base sources, and a stub revenue model that builds end-to-end.", status: "done", assigneeId: "emp-104", priority: "medium", storyPoints: 3, dueDate: "2026-04-23", sprintId: "p4-sp-1", estimatedHours: 8, trackedHours: 7, createdAt: "2026-04-15", lastStatusChangeAt: "2026-04-23" },
  { id: "p4-t-108", projectId: "p-4", title: "QA: data parity smoke checks", description: "Automated parity job comparing top 20 critical metrics across Snowflake vs lake. Alert if drift > 0.5%.", status: "done", assigneeId: "emp-109", priority: "high", storyPoints: 3, dueDate: "2026-04-28", sprintId: "p4-sp-1", estimatedHours: 9, trackedHours: 8, createdAt: "2026-04-22", lastStatusChangeAt: "2026-04-28" },

  // ─────────── Project 4 — Sprint 2 (active) ───────────
  { id: "p4-t-201", projectId: "p-4", title: "Customer events stream (Kafka → lake)", description: "Subscribe to the customer-events topic, deserialize Avro, write to staging.customer_events as Iceberg.", status: "in_progress", assigneeId: "emp-104", priority: "critical", storyPoints: 8, dueDate: "2026-05-15", sprintId: "p4-sp-2", estimatedHours: 22, trackedHours: 19, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-08" },
  { id: "p4-t-202", projectId: "p-4", title: "Finance ledger ingestion", description: "Nightly batch ingestion of finance ledger entries. Schema-on-read for header + tax rows; soft-delete propagation.", status: "in_progress", assigneeId: "emp-107", priority: "high", storyPoints: 5, dueDate: "2026-05-17", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 11, createdAt: "2026-04-30", lastStatusChangeAt: "2026-05-09" },
  { id: "p4-t-203", projectId: "p-4", title: "Catalog: dim_customer + fact_orders", description: "Conformed dimensional models in dbt. dim_customer slowly-changing type-2; fact_orders grain = one row per order line.", status: "in_progress", assigneeId: "emp-104", priority: "critical", storyPoints: 5, dueDate: "2026-05-16", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 13, createdAt: "2026-04-29", lastStatusChangeAt: "2026-05-08", dependsOn: ["p4-t-201"] },
  { id: "p4-t-204", projectId: "p-4", title: "dbt models: revenue per region", description: "Materialized model rolling up revenue by region/month. Tests for non-null region and monotonic month index.", status: "todo", assigneeId: "emp-104", priority: "high", storyPoints: 3, dueDate: "2026-05-18", sprintId: "p4-sp-2", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-01", dependsOn: ["p4-t-203"] },
  { id: "p4-t-205", projectId: "p-4", title: "Lineage visualizer", description: "Pull dbt manifest + Airflow run history; render a graph of upstream/downstream dependencies per table.", status: "todo", assigneeId: "emp-110", priority: "medium", storyPoints: 5, dueDate: "2026-05-19", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 3, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-04" },
  { id: "p4-t-206", projectId: "p-4", title: "Late-arriving data handling", description: "Define watermarking + backfill strategy for events that arrive >24h late. Reprocess affected daily aggregates.", status: "todo", assigneeId: "emp-104", priority: "high", storyPoints: 5, dueDate: "2026-05-17", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-01", lastStatusChangeAt: "2026-05-01" },
  { id: "p4-t-207", projectId: "p-4", title: "Spark job for nightly aggregates", description: "EMR Spark job rolling up event partitions into daily aggregates. Idempotent re-runs; checkpoint on S3.", status: "in_review", assigneeId: "emp-103", priority: "high", storyPoints: 5, dueDate: "2026-05-14", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 15, createdAt: "2026-05-02", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-208", projectId: "p-4", title: "API: read-only catalog query", description: "Internal HTTP API returning a paginated list of tables, columns, and freshness metadata. Used by BI dashboards.", status: "in_review", assigneeId: "emp-107", priority: "medium", storyPoints: 3, dueDate: "2026-05-13", sprintId: "p4-sp-2", estimatedHours: 9, trackedHours: 8, createdAt: "2026-05-03", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-209", projectId: "p-4", title: "Slack daily ETL summary", description: "Daily summary message: jobs run, durations, failures, and freshness deltas. Posts at 8am local to a #data channel.", status: "in_review", assigneeId: "emp-103", priority: "low", storyPoints: 2, dueDate: "2026-05-13", sprintId: "p4-sp-2", estimatedHours: 5, trackedHours: 5, createdAt: "2026-05-05", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-210", projectId: "p-4", title: "QA: regression on dim_customer", description: "Suite verifying SCD-2 transitions, null handling, and merge correctness on dim_customer across multiple CDC events.", status: "in_review", assigneeId: "emp-109", priority: "high", storyPoints: 3, dueDate: "2026-05-15", sprintId: "p4-sp-2", estimatedHours: 9, trackedHours: 7, createdAt: "2026-05-06", lastStatusChangeAt: "2026-05-13", dependsOn: ["p4-t-203"] },
  { id: "p4-t-211", projectId: "p-4", title: "Cost dashboard (S3 + compute)", description: "Internal dashboard tracking S3 storage growth and EMR/Spark compute spend by team/owner.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 3, dueDate: "2026-05-18", sprintId: "p4-sp-2", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-08", lastStatusChangeAt: "2026-05-08" },
  { id: "p4-t-212", projectId: "p-4", title: "Schema-change detection", description: "Monitor source schemas; alert + open PR when columns are added/removed/renamed upstream. Avoid silent pipeline breaks.", status: "backlog", assigneeId: "emp-104", priority: "high", storyPoints: 5, dueDate: "2026-05-19", sprintId: "p4-sp-2", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-09", lastStatusChangeAt: "2026-05-09" },

  // ─────────── Project 4 — Sprint 3 (future) ───────────
  { id: "p4-t-301", projectId: "p-4", title: "PII classifier on new tables", description: "Run a lightweight classifier (regex + ML) on new tables to flag potential PII columns for review.", status: "backlog", assigneeId: "emp-110", priority: "critical", storyPoints: 5, dueDate: "2026-05-27", sprintId: "p4-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p4-t-302", projectId: "p-4", title: "Soft-delete propagation", description: "Propagate upstream soft-deletes through marts. Maintain history columns; expose helper for analyst queries.", status: "backlog", assigneeId: "emp-104", priority: "high", storyPoints: 5, dueDate: "2026-05-29", sprintId: "p4-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p4-t-303", projectId: "p-4", title: "Anomaly detection alerts", description: "Detect statistical anomalies in nightly aggregates (z-score > 3). Alert via Slack with the affected metric + run id.", status: "backlog", assigneeId: "emp-110", priority: "medium", storyPoints: 5, dueDate: "2026-05-30", sprintId: "p4-sp-3", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p4-t-304", projectId: "p-4", title: "Data-quality SLA dashboard", description: "Track freshness, completeness, and row-count SLAs per table. Surface breaches; link to runbook.", status: "backlog", assigneeId: "emp-103", priority: "medium", storyPoints: 3, dueDate: "2026-06-01", sprintId: "p4-sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },
  { id: "p4-t-305", projectId: "p-4", title: "Lineage to BI tools", description: "Extend the lineage view to terminate at Looker/Mode dashboards. Helps trace impact of upstream schema changes.", status: "backlog", assigneeId: null, priority: "medium", storyPoints: 3, dueDate: "2026-06-02", sprintId: "p4-sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10", dependsOn: ["p4-t-205"] },
  { id: "p4-t-306", projectId: "p-4", title: "Access audit log", description: "Append-only audit of who queried which table and when. Helps with compliance reviews and access cleanup.", status: "backlog", assigneeId: "emp-111", priority: "high", storyPoints: 3, dueDate: "2026-05-30", sprintId: "p4-sp-3", estimatedHours: 9, trackedHours: 0, createdAt: "2026-05-10", lastStatusChangeAt: "2026-05-10" },

  // ─────────── Project 4 — Sprint 4 (future) ───────────
  { id: "p4-t-401", projectId: "p-4", title: "Migration cutover plan doc", description: "Detailed cutover plan: dual-write window, validation steps, rollback triggers, comms cadence to BI users.", status: "backlog", assigneeId: "emp-104", priority: "critical", storyPoints: 3, dueDate: "2026-06-06", sprintId: "p4-sp-4", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-402", projectId: "p-4", title: "Dual-write to lake + Snowflake", description: "Toggle to write to both warehouses during the migration. Verify parity hourly; surface drift in the cost dashboard.", status: "backlog", assigneeId: "emp-103", priority: "high", storyPoints: 5, dueDate: "2026-06-10", sprintId: "p4-sp-4", estimatedHours: 14, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-403", projectId: "p-4", title: "BI tool repointing checklist", description: "Per-tool checklist (Looker, Mode, Tableau) for repointing connectors to the lakehouse. Includes validation queries.", status: "backlog", assigneeId: "emp-104", priority: "high", storyPoints: 3, dueDate: "2026-06-13", sprintId: "p4-sp-4", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },
  { id: "p4-t-404", projectId: "p-4", title: "Final Snowflake export to cold storage", description: "Export the full historical Snowflake data to S3 Glacier as a long-term archive. Verifiable manifests.", status: "backlog", assigneeId: "emp-103", priority: "medium", storyPoints: 3, dueDate: "2026-06-16", sprintId: "p4-sp-4", estimatedHours: 8, trackedHours: 0, createdAt: "2026-05-12", lastStatusChangeAt: "2026-05-12" },

  // ─────────── Scope-creep tasks (added mid-sprint) ───────────
  // Each was created AFTER its sprint started; statusHistory enrichment records a sprint_move entry.
  { id: "t-216", projectId: "p-1", title: "Hotfix: drag-drop crash in Safari", description: "Safari 17 reports 'maxTouchPoints undefined' during dnd-kit pointer events. Patch with a feature-detect fallback.", status: "in_progress", assigneeId: "tm-3", priority: "high", storyPoints: 2, dueDate: "2026-05-15", sprintId: "sp-2", estimatedHours: 5, trackedHours: 3, createdAt: "2026-05-08", lastStatusChangeAt: "2026-05-10" },
  { id: "p2-t-211", projectId: "p-2", title: "Hotfix: attachment upload silently dropping > 5MB", description: "Front-end multipart payload was capped at 5MB despite a 10MB backend limit. Align both and surface a clear error.", status: "todo", assigneeId: "p2-tm-3", priority: "high", storyPoints: 2, dueDate: "2026-05-17", sprintId: "p2-sp-2", estimatedHours: 5, trackedHours: 0, createdAt: "2026-05-06", lastStatusChangeAt: "2026-05-06" },
  { id: "p3-t-213", projectId: "p-3", title: "Hotfix: peer-feedback save loses formatting", description: "Tiptap output was being stripped on save. Persist as HTML, not plain text, and re-hydrate on edit.", status: "in_progress", assigneeId: "emp-101", priority: "high", storyPoints: 2, dueDate: "2026-05-16", sprintId: "p3-sp-2", estimatedHours: 5, trackedHours: 2, createdAt: "2026-05-07", lastStatusChangeAt: "2026-05-09" },
  { id: "p4-t-213", projectId: "p-4", title: "Hotfix: Kafka consumer OOM on burst topics", description: "Memory ballooning when burst consumer lag exceeds 50k. Add backpressure + reduce poll batch size.", status: "in_progress", assigneeId: "emp-104", priority: "critical", storyPoints: 3, dueDate: "2026-05-16", sprintId: "p4-sp-2", estimatedHours: 8, trackedHours: 4, createdAt: "2026-05-05", lastStatusChangeAt: "2026-05-08" },
];

// ─────────────────────────── Goals & milestones ───────────────────────────

export const goals: Goal[] = [
  // p-1 SmartPM
  {
    id: "g-p1-q2-launch",
    projectId: "p-1",
    name: "Public Beta Launch",
    kind: "milestone",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-06-16",
    status: "on_track",
    description: "Ship the public beta of SmartPM with board, analytics, AI assistant, and integrations.",
  },
  {
    id: "g-p1-q2-ai",
    projectId: "p-1",
    name: "AI Assistant GA",
    kind: "goal",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-06-02",
    status: "on_track",
    description: "Bring the AI assistant out of preview: tool coverage, telemetry, and confirmation UX.",
  },
  // p-2 Customer Portal
  {
    id: "g-p2-q2-ai-routing",
    projectId: "p-2",
    name: "AI Ticket Routing Live",
    kind: "milestone",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-06-02",
    status: "on_track",
    description: "Roll the NLP-driven ticket routing to all queues with fallback safeguards.",
  },
  // p-3 HR Platform
  {
    id: "g-p3-q2-reviews",
    projectId: "p-3",
    name: "Performance Reviews Cycle Ready",
    kind: "goal",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-05-19",
    status: "at_risk",
    description: "Ship the full 360 review pipeline in time for the Q2 cycle window.",
  },
  // p-4 Data Lake
  {
    id: "g-p4-q2-cutover",
    projectId: "p-4",
    name: "Snowflake Decommission",
    kind: "milestone",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-06-16",
    status: "on_track",
    description: "Cut all BI tooling over to the lakehouse and archive the historical Snowflake instance.",
  },
  {
    id: "g-p4-q2-quality",
    projectId: "p-4",
    name: "Data Quality SLAs",
    kind: "goal",
    quarter: "Q2",
    year: 2026,
    targetDate: "2026-06-02",
    status: "on_track",
    description: "Per-table freshness, completeness, and row-count SLAs surfaced and alerted.",
  },
];

// ─────────────────────────── Task enrichment ───────────────────────────
// We avoid touching the ~80 inline task definitions above. Instead we derive
// `type`, `goalIds`, and `statusHistory` from per-task rules + the existing
// createdAt / status / lastStatusChangeAt. Explicit overrides win for reopens
// and scope-creep entries that need precise transition dates.

const TASK_TYPE_OVERRIDES: Record<string, TaskType> = {
  // Bugs (QA-shaped tasks + the four hotfix scope-creep entries)
  "t-109": "bug",
  "t-211": "bug",
  "t-216": "bug",
  "t-405": "bug",
  "p2-t-105": "bug",
  "p2-t-207": "bug",
  "p2-t-211": "bug",
  "p2-t-405": "bug",
  "p3-t-108": "bug",
  "p3-t-211": "bug",
  "p3-t-213": "bug",
  "p4-t-108": "bug",
  "p4-t-210": "bug",
  "p4-t-213": "bug",
  // Chores
  "t-101": "chore",
  "t-110": "chore",
  "t-212": "chore",
  "t-213": "chore",
  "t-214": "chore",
  "t-215": "chore",
  "t-304": "chore",
  "t-401": "chore",
  "p2-t-101": "chore",
  "p2-t-209": "chore",
  "p2-t-210": "chore",
  "p3-t-105": "chore",
  "p3-t-107": "chore",
  "p4-t-107": "chore",
  "p4-t-401": "chore",
  "p4-t-403": "chore",
  // Spikes
  "t-403": "spike",
  "p2-t-301": "spike",
  "p4-t-301": "spike",
  "p4-t-303": "spike",
};

// Goal linkage. Tasks not listed here get an empty goalIds array (== unaligned).
// p-1: launch milestone covers most sprint 3 + 4 work, ai goal covers the assistant work.
// p-2/p-3/p-4: roughly half of the active-quarter backlog is aligned.
const TASK_GOAL_LINKS: Record<string, string[]> = {
  // p-1 → AI Assistant GA + Launch
  "t-206": ["g-p1-q2-ai"],
  "t-402": ["g-p1-q2-launch", "g-p1-q2-ai"],
  // p-1 → Launch milestone
  "t-203": ["g-p1-q2-launch"],
  "t-204": ["g-p1-q2-launch"],
  "t-207": ["g-p1-q2-launch"],
  "t-209": ["g-p1-q2-launch"],
  "t-301": ["g-p1-q2-launch"],
  "t-302": ["g-p1-q2-launch"],
  "t-303": ["g-p1-q2-launch"],
  "t-304": ["g-p1-q2-launch"],
  "t-305": ["g-p1-q2-launch"],
  "t-401": ["g-p1-q2-launch"],
  "t-403": ["g-p1-q2-launch"],
  "t-404": ["g-p1-q2-launch"],
  "t-405": ["g-p1-q2-launch"],
  "t-406": ["g-p1-q2-launch"],
  "t-216": ["g-p1-q2-launch"],

  // p-2 → AI Ticket Routing
  "p2-t-301": ["g-p2-q2-ai-routing"],
  "p2-t-302": ["g-p2-q2-ai-routing"],
  "p2-t-303": ["g-p2-q2-ai-routing"],
  "p2-t-201": ["g-p2-q2-ai-routing"],
  "p2-t-205": ["g-p2-q2-ai-routing"],
  "p2-t-403": ["g-p2-q2-ai-routing"],
  "p2-t-404": ["g-p2-q2-ai-routing"],

  // p-3 → Performance Reviews
  "p3-t-201": ["g-p3-q2-reviews"],
  "p3-t-202": ["g-p3-q2-reviews"],
  "p3-t-203": ["g-p3-q2-reviews"],
  "p3-t-204": ["g-p3-q2-reviews"],
  "p3-t-205": ["g-p3-q2-reviews"],
  "p3-t-206": ["g-p3-q2-reviews"],
  "p3-t-207": ["g-p3-q2-reviews"],
  "p3-t-209": ["g-p3-q2-reviews"],
  "p3-t-210": ["g-p3-q2-reviews"],
  "p3-t-211": ["g-p3-q2-reviews"],
  "p3-t-212": ["g-p3-q2-reviews"],
  "p3-t-213": ["g-p3-q2-reviews"],

  // p-4 → Cutover milestone & Quality goal
  "p4-t-201": ["g-p4-q2-cutover"],
  "p4-t-202": ["g-p4-q2-cutover"],
  "p4-t-203": ["g-p4-q2-cutover"],
  "p4-t-204": ["g-p4-q2-cutover"],
  "p4-t-206": ["g-p4-q2-cutover"],
  "p4-t-207": ["g-p4-q2-cutover"],
  "p4-t-212": ["g-p4-q2-cutover"],
  "p4-t-213": ["g-p4-q2-cutover"],
  "p4-t-401": ["g-p4-q2-cutover"],
  "p4-t-402": ["g-p4-q2-cutover"],
  "p4-t-403": ["g-p4-q2-cutover"],
  "p4-t-404": ["g-p4-q2-cutover"],
  "p4-t-304": ["g-p4-q2-quality"],
  "p4-t-303": ["g-p4-q2-quality"],
  "p4-t-302": ["g-p4-q2-quality"],
  "p4-t-301": ["g-p4-q2-quality"],
  "p4-t-306": ["g-p4-q2-quality"],
};

// Explicit statusHistory for tasks that need precise transition dates —
// reopens (done → non-done → done) and scope-creep sprint_move entries.
const STATUS_HISTORY_OVERRIDES: Record<string, StatusTransition[]> = {
  // p-1 reopens — t-105 and t-106 each cycled back through review once.
  "t-105": [
    { kind: "status", from: null, to: "todo", at: "2026-04-16" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-18" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-04-22" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-24" },
    { kind: "status", from: "done", to: "in_review", at: "2026-04-25" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-26" },
  ],
  "t-106": [
    { kind: "status", from: null, to: "todo", at: "2026-04-17" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-19" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-04-23" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-25" },
    { kind: "status", from: "done", to: "in_review", at: "2026-04-26" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-27" },
  ],
  // p-2 portal shell reopened once.
  "p2-t-104": [
    { kind: "status", from: null, to: "todo", at: "2026-04-15" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-18" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-04-21" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-22" },
    { kind: "status", from: "done", to: "todo", at: "2026-04-23" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-24" },
    { kind: "status", from: "in_progress", to: "done", at: "2026-04-25" },
  ],
  // p-3 admin dashboard reopened once.
  "p3-t-107": [
    { kind: "status", from: null, to: "todo", at: "2026-04-16" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-19" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-04-24" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-25" },
    { kind: "status", from: "done", to: "in_review", at: "2026-04-26" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-27" },
  ],
  // p-4 dbt scaffold reopened TWICE — should top the reopen leaderboard.
  "p4-t-107": [
    { kind: "status", from: null, to: "todo", at: "2026-04-15" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-17" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-04-19" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-20" },
    { kind: "status", from: "done", to: "in_review", at: "2026-04-21" },
    { kind: "status", from: "in_review", to: "done", at: "2026-04-22" },
    { kind: "status", from: "done", to: "todo", at: "2026-04-22" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-04-22" },
    { kind: "status", from: "in_progress", to: "done", at: "2026-04-23" },
  ],
  // Scope-creep entries — sprint_move INTO the active sprint after its start date.
  "t-216": [
    { kind: "status", from: null, to: "todo", at: "2026-05-08" },
    { kind: "sprint_move", from: null, to: "sp-2", at: "2026-05-08" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-05-10" },
  ],
  "t-211": [
    { kind: "status", from: null, to: "todo", at: "2026-05-06" },
    { kind: "sprint_move", from: null, to: "sp-2", at: "2026-05-06" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-05-08" },
    { kind: "status", from: "in_progress", to: "in_review", at: "2026-05-12" },
  ],
  "p2-t-211": [
    { kind: "status", from: null, to: "todo", at: "2026-05-06" },
    { kind: "sprint_move", from: null, to: "p2-sp-2", at: "2026-05-06" },
  ],
  "p3-t-213": [
    { kind: "status", from: null, to: "todo", at: "2026-05-07" },
    { kind: "sprint_move", from: null, to: "p3-sp-2", at: "2026-05-07" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-05-09" },
  ],
  "p4-t-213": [
    { kind: "status", from: null, to: "todo", at: "2026-05-05" },
    { kind: "sprint_move", from: null, to: "p4-sp-2", at: "2026-05-05" },
    { kind: "status", from: "todo", to: "in_progress", at: "2026-05-08" },
  ],
};

function addDaysISO(date: string, days: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetweenISO(from: string, to: string): number {
  const a = new Date(from + "T00:00:00Z").getTime();
  const b = new Date(to + "T00:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function inferTaskType(task: Task): TaskType {
  const override = TASK_TYPE_OVERRIDES[task.id];
  if (override) return override;
  const text = `${task.title} ${task.description ?? ""}`.toLowerCase();
  if (/\bqa\b|regression|smoke|a11y|hotfix|bugfix/.test(text)) return "bug";
  if (/scaffold|tokens|config|template|readme|docs|setup|inventory/.test(text)) return "chore";
  if (/spike|classifier|prototype|investigate|research/.test(text)) return "spike";
  return "feature";
}

function generateStatusHistory(task: Task): StatusTransition[] {
  const override = STATUS_HISTORY_OVERRIDES[task.id];
  if (override) return override;

  if (task.status === "backlog") {
    return [{ kind: "status", from: null, to: "backlog", at: task.createdAt }];
  }
  if (task.status === "todo") {
    return [{ kind: "status", from: null, to: "todo", at: task.createdAt }];
  }

  const path: Status[] =
    task.status === "in_progress"
      ? ["todo", "in_progress"]
      : task.status === "in_review"
        ? ["todo", "in_progress", "in_review"]
        : ["todo", "in_progress", "in_review", "done"]; // done

  const start = task.createdAt;
  const end = task.lastStatusChangeAt >= start ? task.lastStatusChangeAt : start;
  const span = Math.max(daysBetweenISO(start, end), 1);

  const out: StatusTransition[] = [{ kind: "status", from: null, to: path[0], at: start }];
  for (let i = 1; i < path.length; i++) {
    const at =
      i === path.length - 1 ? end : addDaysISO(start, Math.round((span * i) / (path.length - 1)));
    out.push({ kind: "status", from: path[i - 1], to: path[i], at });
  }
  return out;
}

function enrichTask(task: Task): Task {
  return {
    ...task,
    type: inferTaskType(task),
    goalIds: TASK_GOAL_LINKS[task.id] ?? [],
    statusHistory: generateStatusHistory(task),
  };
}

export const tasks: Task[] = rawTasks.map(enrichTask);

export const blockerLog: BlockerLog[] = [
  // Project 1 — Sprint 1 (closed) — resolved
  { id: "bl-1", taskId: "t-105", detectedAt: "2026-04-23", description: "Waiting on email service credentials", suggestion: "Escalate to ops for SendGrid keys.", resolved: true, resolvedAt: "2026-04-25" },
  { id: "bl-2", taskId: "t-106", detectedAt: "2026-04-24", description: "Google OAuth callback URL mismatch", suggestion: "Update redirect URIs in Google console.", resolved: true, resolvedAt: "2026-04-26" },
  { id: "bl-3", taskId: "t-108", detectedAt: "2026-04-26", description: "iOS keychain entitlement missing", suggestion: "Add keychain-access-groups entitlement.", resolved: true, resolvedAt: "2026-04-27" },
  { id: "bl-4", taskId: "t-109", detectedAt: "2026-04-27", description: "Test env auth tokens expiring", suggestion: "Bump token TTL for staging env.", resolved: true, resolvedAt: "2026-04-28" },

  // Project 1 — Sprint 2 (active) — mix
  { id: "bl-5", taskId: "t-207", detectedAt: "2026-05-09", description: "dnd-kit sortable preset incompatible with virtualized columns", suggestion: "Drop virtualization for v1 — 30 tasks fit comfortably.", resolved: false },
  { id: "bl-6", taskId: "t-208", detectedAt: "2026-05-10", description: "APNs cert rotation needed before push setup", suggestion: "Pull new cert from Apple developer portal.", resolved: false },
  { id: "bl-7", taskId: "t-205", detectedAt: "2026-05-11", description: "Filter bar depends on Kanban board (t-203) still in To Do", suggestion: "Unblock by landing t-203 skeleton first.", resolved: false },
  { id: "bl-8", taskId: "t-209", detectedAt: "2026-05-06", description: "Schema mismatch with frontend Task type", suggestion: "Align field names: assigneeId vs assignee_id.", resolved: true, resolvedAt: "2026-05-11" },

  // Project 2 — active
  { id: "p2-bl-1", taskId: "p2-t-201", detectedAt: "2026-05-10", description: "Multi-step form state library not finalized", suggestion: "Lock in React Hook Form vs XState by EOD.", resolved: false },
  { id: "p2-bl-2", taskId: "p2-t-202", detectedAt: "2026-05-11", description: "Security review pending on virus scan vendor", suggestion: "Loop in security; default to ClamAV if review slips past sprint end.", resolved: false },

  // Project 3 — active
  { id: "p3-bl-1", taskId: "p3-t-201", detectedAt: "2026-05-09", description: "Autosave conflicts when two browser tabs edit the same draft", suggestion: "Add an etag check on PATCH; conflict response prompts the user to refresh.", resolved: false },
  { id: "p3-bl-2", taskId: "p3-t-205", detectedAt: "2026-05-10", description: "Legal hasn't approved anonymous-feedback retention policy", suggestion: "Default to 90-day retention; flag for legal review before launch.", resolved: false },
  { id: "p3-bl-3", taskId: "p3-t-204", detectedAt: "2026-05-12", description: "Reviewer assignment depends on org-chart import that's still in progress", suggestion: "Stub the org chart with a flat list; replace once import lands.", resolved: false },

  // Project 4 — active
  { id: "p4-bl-1", taskId: "p4-t-201", detectedAt: "2026-05-08", description: "Avro schema registry credentials still pending from platform team", suggestion: "Use a temporary local schema cache; swap to registry when credentials land.", resolved: false },
  { id: "p4-bl-2", taskId: "p4-t-205", detectedAt: "2026-05-11", description: "dbt manifest parser doesn't expose Airflow run linkage", suggestion: "Parse the Airflow runs API separately and join in the renderer for v1.", resolved: false },
  { id: "p4-bl-3", taskId: "p4-t-206", detectedAt: "2026-05-13", description: "Watermarking policy hasn't been signed off by finance + product", suggestion: "Pick a 24h watermark for v1 and document trade-offs; revisit after launch.", resolved: false },
];
