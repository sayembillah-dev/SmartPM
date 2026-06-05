# SmartPM — Complete A-Z Project Documentation

> **Audience:** University internship write-up reference. Feed this entire document to an AI assistant for context-aware answers about the project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Root Directory Structure](#3-root-directory-structure)
4. [Environment Variables](#4-environment-variables)
5. [Configuration Files](#5-configuration-files)
6. [App Router — Pages & Routes](#6-app-router--pages--routes)
7. [API Routes (Backend Endpoints)](#7-api-routes-backend-endpoints)
8. [Type System](#8-type-system)
9. [State Management](#9-state-management)
10. [Library Modules](#10-library-modules)
11. [Components — Full Inventory](#11-components--full-inventory)
12. [AI Integration Architecture](#12-ai-integration-architecture)
13. [Data Layer (Seed Data)](#13-data-layer-seed-data)
14. [Analytics Engine](#14-analytics-engine)
15. [Drag-and-Drop System](#15-drag-and-drop-system)
16. [Theming & Styling](#16-theming--styling)
17. [Data Flow Diagrams](#17-data-flow-diagrams)
18. [Key Architectural Decisions](#18-key-architectural-decisions)
19. [Build, Dev & Deployment](#19-build-dev--deployment)
20. [Known Gaps & Future Work](#20-known-gaps--future-work)
21. [Glossary](#21-glossary)

---

## 1. Project Overview

**SmartPM** is an AI-powered, agentic project management web application. It combines a traditional Kanban-style sprint board with an embedded AI assistant that can read the full sprint context and take actions (create tasks, reassign work, move tasks between sprints) on the user's behalf after confirmation.

### Core Value Propositions

| Capability | Description |
|---|---|
| **Kanban Sprint Board** | Drag-and-drop task management across 5 columns (Backlog → Done) |
| **AI Chat Assistant** | GPT-powered PM assistant that understands sprint state and proposes mutations |
| **Real-Time Analytics** | Burndown charts, team load, estimation accuracy, velocity trends |
| **Risk & Blocker Detection** | Automatic detection of stalled tasks, overdue items, and dependency blocks |
| **Multi-Project Support** | Switch between up to N projects; state is isolated per project |
| **Team & Resource Management** | Global employee pool, project memberships, capacity planning |

### Application Status

- **Type:** Demo / prototype (in-memory seed data, no persistent backend)
- **Primary Use:** University internship project demonstrating AI-augmented PM tooling
- **Deployment:** Local development; Vercel-deployable
- **Authentication:** None (open demo)

---

## 2. Technology Stack

### Runtime & Framework

| Layer | Technology | Version | Role |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | Full-stack React framework (App Router) |
| Language | TypeScript | 5 | Static typing across all files |
| Runtime | Node.js | ≥18 (LTS) | Server-side API routes |
| UI Library | React | 19.2.4 | Component rendering |
| DOM | react-dom | 19.2.4 | Browser DOM bindings |

### Styling & UI

| Technology | Version | Role |
|---|---|---|
| Tailwind CSS | 4 | Utility-first CSS framework |
| shadcn/ui | 4.7.0 | Pre-built accessible component library (base-nova style) |
| @base-ui/react | 1.4.1 | Unstyled headless primitives (underlies shadcn) |
| lucide-react | 1.14.0 | Icon set (~1400 SVG icons as React components) |
| next-themes | 0.4.6 | Light / dark mode management |
| tw-animate-css | 1.4.0 | Tailwind animation utilities |
| tailwind-merge | 3.6.0 | Merge conflicting Tailwind classes safely |
| class-variance-authority | 0.7.1 | Type-safe CSS class variants |
| clsx | 2.1.1 | Conditional class-name utility |
| sonner | 2.0.7 | Toast notification system |

### Data Visualization

| Technology | Version | Role |
|---|---|---|
| recharts | 3.8.1 | React charting (SVG-based: line, bar, area charts) |

### Drag and Drop

| Technology | Version | Role |
|---|---|---|
| @dnd-kit/core | 6.3.1 | Core drag-and-drop primitives |
| @dnd-kit/sortable | 10.0.0 | Sortable list extension |
| @dnd-kit/utilities | 3.2.2 | CSS transform helpers |

### AI & LLM

| Technology | Version | Role |
|---|---|---|
| openai (SDK) | 6.37.0 | TypeScript SDK — Azure OpenAI compatible |
| Azure OpenAI (HEAVY) | gpt-5.4 | Complex reasoning: sprint analysis, summary, chat |
| Azure OpenAI (NANO) | gpt-4.1-mini | Lightweight tasks (defined, not yet wired to routes) |
| react-markdown | 10.1.0 | Render AI markdown responses in browser |

### Tooling

| Technology | Version | Role |
|---|---|---|
| ESLint | 9 | Linting with next/eslint-config |
| PostCSS | — | CSS processing for Tailwind v4 |
| Bun | — | Alternative package manager (bun.lock present) |

---

## 3. Root Directory Structure

```
SmartPM/
│
├── app/                          # Next.js App Router (pages + API)
│   ├── layout.tsx                # Root layout with all providers
│   ├── page.tsx                  # Home: Sprint Board
│   ├── globals.css               # Global styles + CSS custom properties
│   ├── favicon.ico
│   ├── api/
│   │   ├── chat/route.ts         # POST — AI chat streaming
│   │   ├── summary/route.ts      # POST — Sprint summary JSON
│   │   └── explain/route.ts      # POST — Text explain/define streaming
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   ├── team/
│   │   └── page.tsx              # Team management
│   └── resources/
│       └── page.tsx              # Employee resource pool
│
├── components/
│   ├── ui/                       # Base UI primitives (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── avatar.tsx
│   │   ├── tooltip.tsx
│   │   ├── info-tooltip.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── sonner.tsx
│   │
│   ├── board/                    # Kanban board components
│   │   ├── kanban-board.tsx      # Main board + drag context
│   │   ├── column.tsx            # Single status column
│   │   ├── task-card.tsx         # Draggable task card
│   │   ├── task-detail-modal.tsx # Task editing modal
│   │   ├── create-task-dialog.tsx
│   │   ├── filter-bar.tsx
│   │   ├── sprint-selector.tsx
│   │   ├── summary-modal.tsx
│   │   ├── summary-report.tsx
│   │   ├── priority-badge.tsx
│   │   ├── risk-badge.tsx
│   │   └── type-badge.tsx
│   │
│   ├── chat/                     # AI chat interface
│   │   ├── chat-panel.tsx        # Side sheet container
│   │   ├── chat-thread.tsx       # Message thread display
│   │   ├── message-bubble.tsx    # Individual message
│   │   ├── tool-call-card.tsx    # Confirm/reject tool proposals
│   │   ├── prompt-book.tsx       # Suggested prompt templates
│   │   └── selection-tooltip.tsx # Highlight → explain/define popup
│   │
│   ├── layout/                   # App shell
│   │   ├── header.tsx            # Top bar
│   │   ├── sidebar.tsx           # Left nav
│   │   ├── project-selector.tsx  # Project switcher
│   │   ├── app-boot-gate.tsx     # One-time splash screen
│   │   └── loading-screen.tsx    # Animated loading
│   │
│   ├── providers/
│   │   └── smart-pm-provider.tsx # Global React Context + all state
│   │
│   ├── analytics/
│   │   ├── analytics-dashboard.tsx
│   │   ├── kpi-card.tsx
│   │   └── chart-card.tsx
│   │
│   ├── team/
│   │   ├── team-page.tsx
│   │   └── add-team-member-dialog.tsx
│   │
│   └── resources/
│       ├── resources-page.tsx
│       └── employee-dialog.tsx
│
├── lib/
│   ├── utils.ts                  # cn() Tailwind merge helper
│   ├── azure-openai.ts           # Azure OpenAI client factory
│   ├── chat-tools.ts             # 8 AI tool definitions
│   ├── agent-utils.ts            # Analytics, risk, blocker, assignment engine (~869 lines)
│   ├── prompts.ts                # System prompts for chat + summary (~526 lines)
│   └── dummy-data.ts             # Seed data: projects, employees, tasks, sprints (~830 lines)
│
├── types/
│   └── index.ts                  # All TypeScript interfaces and union types
│
├── public/                       # Static assets (SVGs, images)
│
├── .claude/
│   └── settings.local.json       # Claude Code permissions config
│
├── .env.example                  # Environment variable template
├── .env.local                    # Active env (gitignored)
├── .gitignore
├── AGENTS.md                     # Next.js version notice for AI agents
├── CLAUDE.md                     # References AGENTS.md
├── README.md
├── package.json
├── package-lock.json
├── bun.lock
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json               # shadcn/ui config
└── next-env.d.ts                 # Next.js global types
```

---

## 4. Environment Variables

### `.env.example` (template)

```env
AZURE_OPENAI_API_KEY=your-rotated-azure-openai-key
AZURE_OPENAI_API_INSTANCE_NAME=niftyai
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_HEAVY=gpt-5.4
AZURE_OPENAI_DEPLOYMENT_NANO=your-nano-deployment-name
```

### Variable Reference

| Variable | Example Value | Required | Purpose |
|---|---|---|---|
| `AZURE_OPENAI_API_KEY` | `sk-...` | Yes | Authentication key for Azure OpenAI |
| `AZURE_OPENAI_API_INSTANCE_NAME` | `niftyai` | Yes | Azure instance subdomain (`{name}.openai.azure.com`) |
| `AZURE_OPENAI_API_VERSION` | `2025-01-01-preview` | Yes | API version string |
| `AZURE_OPENAI_DEPLOYMENT_HEAVY` | `gpt-5.4` | Yes | Deployment name for complex reasoning tasks |
| `AZURE_OPENAI_DEPLOYMENT_NANO` | `gpt-4.1-mini` | No | Deployment name for lightweight tasks |

### Runtime Access

All env vars are **server-only** (accessed in API routes). They are never exposed to the browser. The `lib/azure-openai.ts` module reads them via `process.env.*`.

---

## 5. Configuration Files

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  }
}
```

**Key settings:**
- `@/*` path alias resolves to the project root, so `@/lib/utils` → `./lib/utils`
- `strict: true` enables all strict type checks (null safety, implicit any, etc.)
- `noEmit: true` — TypeScript is only a type-checker; Next.js/SWC handles compilation

### `next.config.ts`

```typescript
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

Minimal config — relies entirely on Next.js 16 defaults.

### `postcss.config.mjs`

```javascript
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

Uses Tailwind v4's PostCSS plugin instead of the older `tailwindcss` plugin.

### `components.json` (shadcn/ui)

```json
{
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

- **`rsc: true`** — Components default to React Server Components
- **`style: "base-nova"`** — New shadcn v4 design system

---

## 6. App Router — Pages & Routes

Next.js App Router uses the filesystem. Every `page.tsx` in a folder becomes a route.

### Page Map

| URL | File | Component | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | (inline) | Sprint Board — main Kanban view |
| `/analytics` | `app/analytics/page.tsx` | `AnalyticsDashboard` | Charts, KPIs, burndown |
| `/team` | `app/team/page.tsx` | `TeamPage` | Team members, capacity, project assignment |
| `/resources` | `app/resources/page.tsx` | `ResourcesPage` | Global employee pool |

### `app/layout.tsx` — Root Layout

Wraps every page. Responsibilities:
- Applies `SmartPMProvider` (global state)
- Applies `TooltipProvider` (shadcn tooltip system)
- Renders `Toaster` (sonner toast notifications)
- Renders persistent `Sidebar` (left nav)
- Renders persistent `ChatPanel` (right sheet)
- Renders `Header` (top bar) with page-specific children (sprint selector, action buttons)
- Sets document metadata: `title: "SmartPM — Agentic Task Management"`
- Loads Geist font family

### `app/page.tsx` — Sprint Board

```tsx
// Renders:
<KanbanBoard />             // Main board with drag-and-drop
<SprintSelector />          // Dropdown in header slot
<SummaryModal />            // Trigger sprint summary generation
<CreateTaskDialog />        // "New task" button + form dialog
```

Pulls `selectedSprintId`, `tasks`, `team` from `useSmartPM()` context and passes down as props.

---

## 7. API Routes (Backend Endpoints)

All routes live in `app/api/*/route.ts`. They use the Next.js Route Handler pattern.

### `POST /api/chat`

**File:** `app/api/chat/route.ts`

**Purpose:** Stream an AI response to a user's PM question, optionally producing tool call proposals.

**Request Body:**
```typescript
{
  messages: ChatMessage[];    // Full chat history
  context: SprintContext;     // Serialized sprint state (tasks, team, sprints, metrics)
}
```

**Response:** `text/plain` NDJSON stream. Each line is a JSON object:

```jsonc
{ "type": "text", "delta": "Here is what I found..." }   // partial text
{ "type": "tool_call", "call": { "id": "...", "name": "update_task_status", "args": {...}, "status": "pending" } }
{ "type": "done" }
{ "type": "error", "message": "..." }
```

**AI Configuration:**
- Model: `DEPLOYMENT_HEAVY` (gpt-5.4)
- Temperature: 0.4
- Tools: all 8 from `lib/chat-tools.ts`
- System prompt: `chatSystemPrompt(context)` from `lib/prompts.ts`
- Converts `ChatMessage[]` to OpenAI message format, handling tool history

**Streaming Logic:**
```
openai.chat.completions.stream(...)
    → accumulate text deltas → emit { type: "text" }
    → accumulate tool call deltas → when complete, emit { type: "tool_call" }
    → on finish, emit { type: "done" }
```

---

### `POST /api/summary`

**File:** `app/api/summary/route.ts`

**Purpose:** Generate a structured JSON sprint health report (not streamed).

**Request Body:**
```typescript
{
  context: SprintContext;    // Full sprint state
}
```

**Response:** `application/json` — A `SummaryReport` object:

```typescript
interface SummaryReport {
  verdict: {
    level: "healthy" | "watch" | "concerning";
    headline: string;          // One-sentence verdict
  };
  kpis: {
    pointsDone: number;
    pointsPlanned: number;
    completedTasks: number;
    inProgressTasks: number;
    blockersCount: number;
    riskCount: number;
  };
  completed: { taskId: string }[];
  inProgress: { taskId: string; risk: RiskLevel; note: string }[];
  blockers: { blockerId: string; suggestedAction: string }[];
  risks: { taskId: string; rationale: string }[];
  recommendations: { action: string; reason: string }[];
}
```

**AI Configuration:**
- Model: `DEPLOYMENT_HEAVY`
- Temperature: 0.3 (more deterministic than chat)
- No tools (pure analytical generation)
- System prompt: `summarySystemPrompt(context)` from `lib/prompts.ts`
- Parses JSON from AI response (handles markdown code fences)

---

### `POST /api/explain`

**File:** `app/api/explain/route.ts`

**Purpose:** Explain or define a piece of text the user highlighted from an AI response.

**Request Body:**
```typescript
{
  selectedText: string;    // Highlighted text
  aiResponse: string;      // Full AI response for context
  userPrompt: string;      // Original user question
  mode: "explain" | "define";
}
```

**Response:** NDJSON stream (same format as `/api/chat` but text-only):

```jsonc
{ "type": "text", "delta": "..." }
{ "type": "done" }
```

**Modes:**
- `explain` — Friendly, conversational explanation ("What does this mean in plain English?")
- `define` — Technical, precise definition ("What is the technical definition of this term?")

**AI Configuration:**
- Model: `DEPLOYMENT_HEAVY`
- Temperature: 0.4
- No tools
- Small focused system prompt per mode

---

## 8. Type System

**File:** `types/index.ts`

All shared TypeScript types are defined here. Components and API routes import from this single source of truth.

### Core Domain Types

```typescript
// Projects
interface Project {
  id: string;
  name: string;
  description?: string;
}

// Employees (global pool — exist independent of any project)
interface Employee {
  id: string;
  name: string;
  role: string;
  description?: string;
  avatarInitial: string;
  weeklyCapacityPoints: number;   // e.g., 10 = 10 story points per week capacity
}

// Team Members (Employee scoped to a specific project)
interface TeamMember {
  id: string;           // Same as Employee.id
  projectId: string;
  name: string;
  role: string;
  description?: string;
  avatarInitial: string;
  weeklyCapacityPoints: number;
}

// Project ↔ Employee mapping
interface ProjectMembership {
  projectId: string;
  employeeId: string;
}
```

### Task & Sprint Types

```typescript
type Status = "backlog" | "todo" | "in_progress" | "in_review" | "done";
type Priority = "critical" | "high" | "medium" | "low";
type RiskLevel = "on_track" | "at_risk" | "overdue";
type SprintStatus = "closed" | "active" | "future";
type TaskType = "bug" | "feature" | "chore" | "spike";
type TransitionKind = "status" | "sprint_move" | "assignee_change";

interface StatusTransition {
  kind: TransitionKind;
  from: string | null;    // Previous value
  to: string | null;      // New value
  at: string;             // YYYY-MM-DD timestamp
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: Status;
  assigneeId: string | null;
  priority: Priority;
  storyPoints: 1 | 2 | 3 | 5 | 8;     // Fibonacci scale
  dueDate: string;                       // YYYY-MM-DD
  sprintId: string;
  dependsOn?: string[];                  // Task IDs this task depends on
  estimatedHours?: number;
  trackedHours?: number;
  createdAt: string;                     // YYYY-MM-DD
  lastStatusChangeAt: string;            // YYYY-MM-DD
  type?: TaskType;
  goalIds?: string[];                    // Linked goal/milestone IDs
  statusHistory?: StatusTransition[];    // Audit trail
}

interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  status: SprintStatus;
  plannedPoints?: number;
}
```

### Goal & OKR Types

```typescript
interface Goal {
  id: string;
  projectId: string;
  name: string;
  kind: "goal" | "milestone";
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  targetDate: string;     // YYYY-MM-DD
  status: "on_track" | "at_risk" | "missed" | "achieved";
  description?: string;
}
```

### AI & Tool Types

```typescript
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallProposal[];
}

type ToolName =
  | "update_task_status"
  | "reassign_task"
  | "unassign_task"
  | "add_task_dependency"
  | "remove_task_dependency"
  | "create_task"
  | "move_task_to_sprint"
  | "set_task_goals";

type ToolCallStatus = "pending" | "confirmed" | "cancelled" | "failed" | "superseded";

interface ToolCallProposal {
  id: string;
  name: ToolName;
  args: Record<string, unknown>;
  status: ToolCallStatus;
  result?: string;          // Outcome message shown to user
}
```

### Blocker & Risk Types

```typescript
interface BlockerLog {
  id: string;
  taskId: string;
  detectedAt: string;
  description: string;
  suggestion: string;
  resolved: boolean;
  resolvedAt?: string;
}

interface RiskAssessment {
  level: RiskLevel;
  rationale: string;
}
```

### Analytics Types (in `lib/agent-utils.ts`)

```typescript
interface TeamLoad {
  memberId: string;
  name: string;
  openTasks: number;
  totalPoints: number;
  capacityUsedPct: number;
}

interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number | null;
}

interface EstimationAccuracy {
  ratio: number;           // trackedHours / estimatedHours
  label: "under" | "on" | "over";
}

interface MemberAccuracy {
  memberId: string;
  name: string;
  ratio: number;
  label: "under" | "on" | "over";
}

interface AssignmentSuggestion {
  memberId: string | null;
  reason: string;
}
```

---

## 9. State Management

**File:** `components/providers/smart-pm-provider.tsx` (~816 lines)

The entire app state lives in a single React Context. There is no Redux, Zustand, or other external state library.

### Context Shape

```typescript
interface SmartPMContextValue {
  // === Identity ===
  today: string;                              // "YYYY-MM-DD" from dummy-data

  // === Projects ===
  projects: Project[];
  selectedProjectId: string;
  selectedProject: Project;
  setSelectedProjectId: (id: string) => void;

  // === Employees (global) ===
  employees: Employee[];
  memberships: ProjectMembership[];

  // === Project-scoped (auto-filtered to selectedProjectId) ===
  team: TeamMember[];
  sprints: Sprint[];
  tasks: Task[];
  blockers: BlockerLog[];
  goals: Goal[];

  // === Sprint selection ===
  selectedSprintId: string;
  setSelectedSprintId: (id: string) => void;

  // === Task mutations ===
  updateTaskStatus: (taskId, status) => void;
  updateTaskAssignee: (taskId, memberId | null) => void;
  moveTask: (taskId, targetStatus, targetIndex) => void;
  updateTaskTime: (taskId, { estimatedHours?, trackedHours? }) => MutationResult;
  updateTaskSprint: (taskId, sprintId) => MutationResult;
  updateTaskDescription: (taskId, description | null) => MutationResult;
  addTaskDependency: (taskId, dependsOnTaskId) => MutationResult;
  removeTaskDependency: (taskId, dependsOnTaskId) => MutationResult;
  addTask: (draft: TaskDraft) => MutationResult & { id?: string };
  updateTaskGoals: (taskId, goalIds) => MutationResult;

  // === Employee mutations ===
  addEmployee: (draft: EmployeeDraft) => MutationResult & { id?: string };
  updateEmployee: (id, updates) => MutationResult;
  removeEmployee: (id) => MutationResult & { unassignedTaskCount?, removedFromProjects? };

  // === Membership mutations ===
  addMemberToActiveProject: (employeeId) => MutationResult;
  removeMemberFromActiveProject: (employeeId) => MutationResult & { unassignedTaskCount? };

  // === Chat ===
  isChatOpen: boolean;
  toggleChat: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: (m | ((prev) => m)) => void;
  chatPrefillQuery: string | null;
  openChatWithQuery: (question: string) => void;
  clearChatPrefill: () => void;
}
```

### How State Is Organized

All raw data is stored in `useRef`s to avoid stale closures, and mirrored in `useState`s for reactivity:

```
useRef(allTasks)          // Source of truth for all task mutations
useState(allTasksVersion) // Trigger re-render after mutations

useRef(allEmployees)      // Source of truth for employee mutations
useState(allEmployeesVersion)

useRef(memberships)       // Project memberships
useState(membershipsVersion)
```

Derived views (project-scoped `tasks`, `team`, `sprints`) are computed with `useMemo` from the raw arrays, filtered by `selectedProjectId`.

### Project Isolation Pattern

```typescript
const tasks = useMemo(
  () => allTasks.filter(t => t.projectId === selectedProjectId),
  [allTasks, selectedProjectId]
);

const team = useMemo(
  () => allEmployees
    .filter(e => memberships.some(m => m.projectId === selectedProjectId && m.employeeId === e.id))
    .map(e => ({ ...e, projectId: selectedProjectId })),
  [allEmployees, memberships, selectedProjectId]
);
```

### Chat Per-Project Isolation

Chat history is stored per project in a `Map<projectId, ChatMessage[]>`:

```typescript
const [chatByProject, setChatByProject] = useState<Map<string, ChatMessage[]>>(new Map());

const chatMessages = chatByProject.get(selectedProjectId) ?? [];
```

Switching projects shows that project's chat history.

### Status Transition Audit Trail

Every call to `updateTaskStatus` appends to `task.statusHistory`:

```typescript
function updateTaskStatus(taskId: string, newStatus: Status) {
  setAllTasks(prev => prev.map(t => {
    if (t.id !== taskId) return t;
    const transition: StatusTransition = {
      kind: "status",
      from: t.status,
      to: newStatus,
      at: today,
    };
    return {
      ...t,
      status: newStatus,
      lastStatusChangeAt: today,
      statusHistory: [...(t.statusHistory ?? []), transition],
    };
  }));
}
```

### Dependency Cycle Prevention

`addTaskDependency` runs a DFS before committing to detect cycles:

```typescript
function hasCycle(taskId: string, dependsOnTaskId: string, tasks: Task[]): boolean {
  // DFS from dependsOnTaskId; if we reach taskId, it's a cycle
}
```

---

## 10. Library Modules

### `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Used everywhere to compose Tailwind class names without conflicts (e.g., `cn("p-4", isActive && "bg-blue-500")`).

---

### `lib/azure-openai.ts`

Factory module for Azure OpenAI clients. Reads environment variables and exposes two lazy constructors.

```typescript
// Two model tiers
export const heavyClient = () => makeClient(DEPLOYMENT_HEAVY);  // gpt-5.4
export const nanoClient  = () => makeClient(DEPLOYMENT_NANO);   // gpt-4.1-mini

// Guard checks
export function isAzureConfigured(): boolean { ... }
export function isNanoConfigured(): boolean { ... }
```

The `AzureOpenAI` client is initialized with:
- `apiKey` — from env
- `apiVersion` — from env
- `endpoint` — constructed as `https://{instance}.openai.azure.com`
- `deployment` — from env (HEAVY or NANO)

---

### `lib/chat-tools.ts` — AI Tool Definitions

Defines 8 OpenAI function-calling tool schemas. Each tool follows the OpenAI `ChatCompletionTool` format.

#### Tool 1: `update_task_status`
```typescript
{
  name: "update_task_status",
  description: "Move a task to a new status column on the Kanban board",
  parameters: {
    taskId: { type: "string" },
    newStatus: { enum: ["backlog", "todo", "in_progress", "in_review", "done"] }
  },
  required: ["taskId", "newStatus"]
}
```

#### Tool 2: `reassign_task`
```typescript
{
  name: "reassign_task",
  description: "Assign a task to a team member",
  parameters: {
    taskId: { type: "string" },
    assigneeId: { type: "string" }
  },
  required: ["taskId", "assigneeId"]
}
```

#### Tool 3: `unassign_task`
```typescript
{
  name: "unassign_task",
  description: "Remove the current assignee from a task",
  parameters: {
    taskId: { type: "string" }
  },
  required: ["taskId"]
}
```

#### Tool 4: `add_task_dependency`
```typescript
{
  name: "add_task_dependency",
  description: "Make taskId depend on dependsOnTaskId (blocks it until the other is done)",
  parameters: {
    taskId: { type: "string" },
    dependsOnTaskId: { type: "string" }
  },
  required: ["taskId", "dependsOnTaskId"]
}
```

#### Tool 5: `remove_task_dependency`
```typescript
{
  name: "remove_task_dependency",
  parameters: {
    taskId: { type: "string" },
    dependsOnTaskId: { type: "string" }
  },
  required: ["taskId", "dependsOnTaskId"]
}
```

#### Tool 6: `move_task_to_sprint`
```typescript
{
  name: "move_task_to_sprint",
  description: "Move a task from its current sprint to a different sprint",
  parameters: {
    taskId: { type: "string" },
    targetSprintId: { type: "string" }
  },
  required: ["taskId", "targetSprintId"]
}
```

#### Tool 7: `create_task`
```typescript
{
  name: "create_task",
  description: "Create a new task in the active project",
  parameters: {
    title: { type: "string", maxLength: 80 },
    priority: { enum: ["critical", "high", "medium", "low"] },
    storyPoints: { enum: [1, 2, 3, 5, 8] },
    dueDate: { type: "string", description: "YYYY-MM-DD" },
    sprintId: { type: "string" },
    assigneeId: { type: "string" },          // optional
    description: { type: "string" },         // optional
    estimatedHours: { type: "number" },      // optional
    dependsOn: { type: "array", items: { type: "string" } }  // optional
  },
  required: ["title", "priority", "storyPoints", "dueDate", "sprintId"]
}
```

#### Tool 8: `set_task_goals`
```typescript
{
  name: "set_task_goals",
  description: "Link or unlink a task to goals/milestones",
  parameters: {
    taskId: { type: "string" },
    goalIds: { type: "array", items: { type: "string" } }
  },
  required: ["taskId", "goalIds"]
}
```

---

### `lib/agent-utils.ts` — Analytics Engine (~869 lines)

The core analytical brain of the application. All functions are pure — they take data as arguments and return computed values with no side effects.

#### Date Utilities

| Function | Signature | Description |
|---|---|---|
| `daysBetween` | `(from: string, to: string) => number` | Calendar days between two YYYY-MM-DD strings |
| `addDays` | `(date: string, days: number) => string` | Returns date + N days |
| `formatDate` | `(date: string) => string` | Returns "May 14" format |

#### Assignment Engine

```typescript
function suggestAssignee(task: Task, team: TeamMember[], allTasks: Task[]): AssignmentSuggestion
```

Algorithm:
1. **Domain keyword matching** — Scans task title/description for domain signals:
   - `frontend`, `ui`, `react`, `css` → frontend role
   - `backend`, `api`, `database`, `server` → backend role
   - `mobile`, `ios`, `android` → mobile role
   - `qa`, `test`, `bug` → QA role
   - `ml`, `model`, `data science` → ML role
   - `design`, `figma`, `ux` → design role
   - `data`, `pipeline`, `etl` → data role
2. **Workload scoring** — Ranks candidates by `(openPoints / weeklyCapacity)` — lower is better
3. **Historical accuracy** — Prefers members whose estimates tend to be accurate
4. Returns `{ memberId, reason }` or `{ memberId: null, reason: "No team members available" }`

#### Blocker Detection

```typescript
function detectBlockers(tasks: Task[], today: string): BlockerLog[]
```

Detects two blocker conditions:
1. **Stall blocker** — Task is `in_progress` and `lastStatusChangeAt` > 3 days ago
2. **Dependency blocker** — Task has `dependsOn` entries where the dependency task is still `backlog` or `todo`

Returns `BlockerLog[]` with description and suggested action.

#### Risk Scoring

```typescript
function scoreRisk(task: Task, today: string, allTasks: Task[], team: TeamMember[]): RiskAssessment
```

Returns `"on_track" | "at_risk" | "overdue"` with a rationale string.

Risk factors checked (in priority order):
1. `dueDate < today` → **overdue**
2. High `storyPoints` relative to days remaining
3. Assignee at capacity (>85% of weekly points in use)
4. Task stalled in current status > 5 days → **at_risk**
5. Has unresolved dependency blockers → **at_risk**
6. Otherwise → **on_track**

#### Sprint Metrics

| Function | Returns | Description |
|---|---|---|
| `sprintVelocity(tasks, sprint)` | `number` | Sum of story points with `status === "done"` in sprint |
| `completionRate(tasks, sprintId)` | `{ done, total, pct }` | % of tasks completed |
| `avgCycleTimeDays(tasks)` | `number` | Average days from `createdAt` to `done` status |
| `burndown(sprint, tasks, today)` | `BurndownPoint[]` | Ideal vs actual remaining points per sprint day |
| `estimationAccuracy(tasks)` | `EstimationAccuracy` | `trackedHours / estimatedHours` ratio |
| `accuracyByMember(tasks, team)` | `MemberAccuracy[]` | Per-member estimation bias |
| `blockersOverTime(blockers)` | `{ date, count }[]` | Blockers grouped by detection date |

#### Team & Workload Analysis

| Function | Returns | Description |
|---|---|---|
| `computeTeamLoad(tasks, team)` | `TeamLoad[]` | Open tasks + points per member + capacity % |
| `workloadImbalance(team, tasks, sprintId)` | `{ gini, stdev, hottest, coldest }` | Statistical workload distribution |
| `cycleTimeByType(tasks)` | `Record<TaskType, number>` | Avg cycle time split by bug/feature/chore/spike |
| `milestoneForecast(sprints, tasks, goal, today, lookback)` | `{ willMeet, confidence, projectedDate }` | Will the goal be met by target date? |
| `goalAlignment(tasks, goalId)` | `{ aligned, total, pct }` | % of tasks linked to a specific goal |
| `scopeCreepEvents(sprint, tasks)` | `Task[]` | Tasks added after sprint start date |
| `reopenedTasks(tasks)` | `Task[]` | Tasks with `done → non-done` transitions |
| `weeklyAccomplishments(tasks, today, days, limit)` | `Task[]` | Top completed tasks in last N days |

#### Insight Detectors

| Function | Returns | Description |
|---|---|---|
| `tasksStaleInStatus(tasks, today, days)` | `Task[]` | Tasks unchanged in status for > N days |
| `highPriorityUnstarted(tasks, today, hoursAhead)` | `Task[]` | Critical/high priority tasks due soon but not started |
| `overdueBlockingMostDownstream(tasks, today)` | `Task[]` | Overdue tasks blocking the most other tasks |

---

### `lib/prompts.ts` — System Prompts (~526 lines)

Exports two functions that return system prompt strings.

#### `chatSystemPrompt(context: SprintContext): string`

Structures the AI to act as a PM assistant. Key rules embedded in the prompt:

**Voice & Formatting:**
- Direct answer first (one sentence), then elaboration if needed
- Default response: 2–4 sentences
- No nested bullet lists — single level only
- Bold only names and key numbers
- Always use task **titles** and member **names**, never raw IDs
- No markdown headings, no emojis in responses

**Pre-Computed Metrics Made Available:**
The prompt injects a `SprintContext` object containing:
- Sprint metadata (dates, status, planned points)
- All tasks with full fields
- Team members with capacity
- Pre-computed: `sprintCompletion`, `avgCycleTimeDays`, `sprintVelocities`, `estimationAccuracy`, `memberAccuracy`, `teamLoad`, `staleInStatus`, `highPriorityUnstartedDueSoon`, `overdueBlockingDownstream`, `workloadImbalance`, `cycleTimeByType`, `milestoneForecasts`, `goalAlignmentByGoal`

**Question Playbook (11 recipes):**
The prompt provides explicit step-by-step reasoning recipes for common PM questions:
1. "What tasks are stalled?" → Use `staleInStatus` pre-computed list
2. "Who is overloaded?" → Compare `teamLoad.capacityUsedPct`
3. "Will we hit the milestone?" → Use `milestoneForecast`
4. "What's blocked?" → Check `blockers` array
5. (etc.)

**Tool Usage Rules:**
- Call tools only for explicit mutations ("move X to done", "assign X to Y")
- Never call tools for analytics questions ("what is the status of X?")
- For bulk operations ("all Sprint 3 tasks"), resolve the full set and call one tool per item
- When extracting meeting notes → use `create_task` for each action item

#### `summarySystemPrompt(context: SprintContext): string`

Instructs the AI to produce a single valid JSON object (the `SummaryReport`). Rules:
- No markdown, no extra text — pure JSON only
- Verdict must be one of: `"healthy"`, `"watch"`, `"concerning"`
- Headlines must be ≤15 words
- All task references must use IDs (not titles) for machine parsing
- Recommendations should be specific and actionable (not generic)

---

### `lib/dummy-data.ts` — Seed Data (~830 lines)

Since there is no database, this file is the data layer for the entire app.

**Exported constants:**

| Export | Type | Description |
|---|---|---|
| `TODAY` | `string` | Fixed date: `"2026-05-14"` |
| `projects` | `Project[]` | 4 projects |
| `DEFAULT_PROJECT_ID` | `string` | `"p-1"` (SmartPM project) |
| `employees` | `Employee[]` | 10+ global employees |
| `projectMemberships` | `ProjectMembership[]` | Which employees belong to which projects |
| `sprints` | `Sprint[]` | Multiple sprints per project |
| `tasks` | `Task[]` | 100+ tasks with full details |
| `goals` | `Goal[]` | Goals and milestones per project |
| `blockerLog` | `BlockerLog[]` | Pre-seeded blocker records |

**The 4 Projects:**
1. **SmartPM** (`p-1`) — The app itself (dogfooding)
2. **Customer Portal v2** (`p-2`) — External portal rebuild
3. **HR Platform** (`p-3`) — Internal HR tooling
4. **Data Lake Migration** (`p-4`) — Infrastructure project

**Sample Employees (from seed data):**
Emran, Priya, Marcus, Hana, Diego, Aisha, Lena, Sayem, and others — each with role, capacity, and avatar initial.

---

## 11. Components — Full Inventory

### `components/ui/` — Base UI Components (18 files)

These are shadcn/ui components, lightly customized. They wrap `@base-ui/react` primitives with Tailwind styling and project-specific variants.

| Component | Key Props | Notes |
|---|---|---|
| `Button` | `variant`, `size` | Variants: default, destructive, outline, ghost, link |
| `Input` | HTML input props | Styled text input |
| `Textarea` | HTML textarea props | Auto-resize supported |
| `Select` | `value`, `onValueChange` | Accessible select with base-ui |
| `Card` | — | Container with border + shadow |
| `Badge` | `variant` | Inline status label |
| `Dialog` | `open`, `onOpenChange` | Modal dialog with overlay |
| `Sheet` | `side` | Slide-in panel (used for chat) |
| `Avatar` | `src`, `fallback` | Circular avatar with initials fallback |
| `Tooltip` | `content` | Hover tooltip (wraps base-ui) |
| `InfoTooltip` | `content` | `(i)` icon with tooltip |
| `DropdownMenu` | `trigger`, `items` | Accessible dropdown |
| `ScrollArea` | `maxHeight` | Custom scrollbar |
| `Separator` | `orientation` | Horizontal/vertical divider |
| `Skeleton` | `className` | Loading placeholder |
| `Sonner` | — | Re-exports sonner's `Toaster` |

---

### `components/board/` — Kanban Board

#### `kanban-board.tsx`

The main board component. Uses `@dnd-kit` for drag-and-drop.

**State:**
- `activeTask` — Currently dragged task (for `DragOverlay`)
- `filters` — `{ assigneeId, priority, riskLevel }`

**Computed:**
- `filteredTasks` — Sprint tasks filtered by active filters
- `tasksByStatus` — `Map<Status, Task[]>` — grouping for 5 columns
- `riskMap` — `Map<taskId, RiskAssessment>` — risk per task
- `blockerTaskIds` — `Set<taskId>` — tasks with active blockers

**Drag Logic:**
```typescript
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  // 1. Identify source column (active.data.current.status)
  // 2. Identify target column (over.id or over.data.current.status)
  // 3. Determine target index within column
  // 4. Call context.moveTask(taskId, targetStatus, targetIndex)
}
```

**Columns rendered:** Backlog | To Do | In Progress | In Review | Done

---

#### `task-card.tsx`

A draggable card representing one task.

**Displayed:**
- Task title
- Priority badge (color-coded)
- Risk level badge
- Type badge (bug/feature/chore/spike)
- Assignee avatar (or unassigned indicator)
- Story points
- Due date
- Blocker alert icon (if in `blockerTaskIds`)
- Dependency count indicator

**Interactions:**
- Click → opens `TaskDetailModal`
- Drag handle → starts dnd-kit drag

---

#### `task-detail-modal.tsx`

Full editing interface for a task (rendered as a `Dialog`).

**Editable fields:**
- Status (button group — click to change)
- Assignee (dropdown with team members + suggestion highlight)
- Estimated hours (number input)
- Tracked hours (number input)
- Description (textarea, auto-saved on blur)
- Dependencies (list + remove button per dependency)
- Goals / Milestones (multi-select checkbox list)

**Read-only display:**
- Title
- Priority, Type, Story Points
- Due date
- Risk assessment with rationale
- Active blockers with suggestions

---

#### `create-task-dialog.tsx`

A `Dialog` with a form for creating new tasks.

**Form fields:**
- Title (required)
- Priority (select)
- Type (select)
- Story Points (select: 1/2/3/5/8)
- Sprint (select — defaults to active sprint)
- Assignee (select — optional)
- Due Date (date input)
- Description (textarea — optional)

On submit → calls `context.addTask(draft)`.

---

#### `filter-bar.tsx`

Renders filter controls above the board.

**Filters available:**
- Assignee (select from team members)
- Priority (select: all/critical/high/medium/low)
- Risk Level (select: all/on_track/at_risk/overdue)

Emits changes via `onFilterChange` callback to `KanbanBoard`.

---

#### `sprint-selector.tsx`

Dropdown to change `selectedSprintId` in context. Renders sprint names with status indicators (active/closed/future).

---

#### `summary-modal.tsx` + `summary-report.tsx`

- `SummaryModal` — button that triggers POST `/api/summary`, shows loading state
- `SummaryReport` — renders the returned `SummaryReport` JSON as formatted UI:
  - Verdict chip (healthy/watch/concerning)
  - KPI cards
  - Completed tasks list
  - In-progress tasks with risk indicators
  - Blockers with suggested actions
  - Risks list
  - Recommendations

---

#### Badge Components

| Component | Props | Colors |
|---|---|---|
| `PriorityBadge` | `priority: Priority` | Critical=red, High=orange, Medium=yellow, Low=gray |
| `RiskBadge` | `level: RiskLevel` | on_track=green, at_risk=yellow, overdue=red |
| `TypeBadge` | `type: TaskType` | bug=red, feature=blue, chore=gray, spike=purple |

---

### `components/chat/` — AI Chat Interface

#### `chat-panel.tsx`

A `Sheet` (shadcn slide-in panel) anchored to the right side of the screen.

**State managed here:**
- `inputValue` — Current text in the message input
- `isStreaming` — Whether an AI response is in progress
- `streamingContent` — Accumulated partial text during streaming

**On user send:**
1. Appends user message to `chatMessages`
2. Builds `SprintContext` from current state (serializes tasks, team, metrics)
3. POSTs to `/api/chat`
4. Reads NDJSON stream line by line
5. Appends text deltas to `streamingContent`
6. When `tool_call` event arrives, creates `ToolCallProposal` with `status: "pending"`
7. On `done`, finalizes message with complete text and tool proposals

**Tool call execution:**
- User clicks "Confirm" on a `ToolCallCard` → executes the appropriate context mutation
- User clicks "Reject" → marks proposal as `"cancelled"`

---

#### `chat-thread.tsx`

Renders the scrollable list of `ChatMessage` objects. For each message:
- `role === "user"` → right-aligned bubble
- `role === "assistant"` → left-aligned with `MessageBubble` + any `ToolCallCard`s

---

#### `message-bubble.tsx`

Renders a single message. Assistant messages use `react-markdown` for formatted output. Implements the `SelectionTooltip` feature (highlights text → shows explain/define popup).

---

#### `tool-call-card.tsx`

Rendered when the AI proposes a tool call. Shows:
- Tool name (human-readable label)
- Arguments (formatted summary)
- Confirm / Reject buttons (only when `status === "pending"`)
- Result text (after execution)
- Status icon (pending/confirmed/cancelled/failed)

---

#### `prompt-book.tsx`

A grid of suggested prompt chips. When clicked, they populate the chat input. Categories include:
- Sprint health checks
- Team workload queries
- Blocker analysis
- Velocity and forecasting

---

#### `selection-tooltip.tsx`

When a user highlights text inside an AI message bubble:
1. A small tooltip appears with "Explain" and "Define" buttons
2. On click → POSTs to `/api/explain` with the selected text + mode
3. Streams the response into a popover

---

### `components/layout/` — App Shell

#### `header.tsx`

Top navigation bar. Contains:
- `ProjectSelector` (left)
- Page title derived from current pathname
- Slot for page-specific children (e.g., `SprintSelector`, "New Task" button)
- AI toggle button (opens/closes `ChatPanel`)

The AI button changes color when chat is open (`isChatOpen` from context).

---

#### `sidebar.tsx`

Persistent left navigation. Items:

| Label | Icon | Route |
|---|---|---|
| Sprint Board | KanbanSquare | `/` |
| Team | Users | `/team` |
| Analytics | BarChart3 | `/analytics` |
| Resources | FolderKanban | `/resources` |

Active route is highlighted with brand color. Footer shows "Demo build — dummy data" disclaimer.

---

#### `project-selector.tsx`

A dropdown in the header that lets the user switch between projects. On change → calls `setSelectedProjectId(id)` → all derived state auto-updates.

---

#### `app-boot-gate.tsx` + `loading-screen.tsx`

One-time animated splash screen shown on first page load per session. Gated by a `sessionStorage` flag so it only shows once. `LoadingScreen` provides the animation.

---

### `components/analytics/` — Analytics Dashboard

#### `analytics-dashboard.tsx`

Full analytics page layout. Sections:
- **Top KPI row:** Completion rate, velocity, cycle time, estimation accuracy
- **Burndown chart:** Ideal vs actual points over sprint
- **Team load chart:** Bar chart — points per member vs capacity
- **Blockers over time:** Line chart
- **Per-member accuracy table:** Estimated vs tracked hours bias

---

#### `kpi-card.tsx`

Small metric card. Props: `label`, `value`, `unit`, `trend` (up/down/neutral), `description`.

---

#### `chart-card.tsx`

Wrapper for `recharts` charts. Props: `title`, `description`, `children` (chart). Provides consistent card styling.

---

### `components/team/` — Team Management

#### `team-page.tsx`

Shows all team members for the active project. For each member:
- Avatar, name, role, description
- Weekly capacity (points per week)
- Current sprint task count and point load
- Remove from project button

Also shows "Add team member" button → opens `AddTeamMemberDialog`.

#### `add-team-member-dialog.tsx`

Dialog listing employees **not yet** in the active project. User selects one → calls `addMemberToActiveProject(employeeId)`.

---

### `components/resources/` — Employee Resources

#### `resources-page.tsx`

Global employee pool — all employees regardless of project. Supports:
- Adding new employees (`EmployeeDialog`)
- Editing existing employees (`EmployeeDialog` in edit mode)
- Removing employees (with warning if they have assigned tasks)

Shows which projects each employee belongs to.

#### `employee-dialog.tsx`

Form dialog for creating or editing an `Employee` record:
- Name (required)
- Role (required)
- Description (optional)
- Avatar Initial (single character, required)
- Weekly Capacity Points (number, required)

---

## 12. AI Integration Architecture

### Model Tier Strategy

| Tier | Deployment | Use Case | Temperature |
|---|---|---|---|
| Heavy | gpt-5.4 | Chat, Summary, Explain | 0.3–0.4 |
| Nano | gpt-4.1-mini | Planned for lightweight ops | N/A (not yet wired) |

### Tool-Calling Flow

The AI does **not** directly mutate state. Instead:

1. AI proposes a tool call (e.g., `update_task_status`)
2. Frontend renders a `ToolCallCard` with "Confirm" / "Reject"
3. User confirms → frontend calls the corresponding context mutation
4. Kanban board updates live

This human-in-the-loop design ensures the AI cannot make unilateral changes.

### Context Serialization

Before each chat API call, the frontend builds a `SprintContext` object:

```typescript
interface SprintContext {
  today: string;
  project: Project;
  sprint: Sprint;
  tasks: Task[];
  team: TeamMember[];
  sprints: Sprint[];
  goals: Goal[];
  blockers: BlockerLog[];

  // Pre-computed analytics (so AI doesn't have to recompute)
  sprintCompletion: { done: number; total: number; pct: number };
  avgCycleTimeDays: number;
  sprintVelocities: { sprintId: string; points: number }[];
  estimationAccuracy: EstimationAccuracy;
  memberAccuracy: MemberAccuracy[];
  teamLoad: TeamLoad[];
  staleInStatus: Task[];
  highPriorityUnstartedDueSoon: Task[];
  overdueBlockingDownstream: Task[];
  workloadImbalance: { gini: number; stdev: number; hottest: TeamMember; coldest: TeamMember };
  cycleTimeByType: Record<TaskType, number>;
  milestoneForecasts: { goalId: string; willMeet: boolean; projectedDate: string }[];
  goalAlignmentByGoal: { goalId: string; pct: number }[];
  scopeCreepEvents: Task[];
  reopenedTasks: Task[];
}
```

This object is JSON-serialized and sent with every request.

### Streaming Protocol

All streaming endpoints use NDJSON (Newline-Delimited JSON):
- Each line is a valid JSON object
- Lines are separated by `\n`
- Frontend reads with `ReadableStream` + `TextDecoder`

```typescript
// Frontend reading pattern
const reader = response.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    const event = JSON.parse(line);
    // handle event.type: "text" | "tool_call" | "done" | "error"
  }
}
```

---

## 13. Data Layer (Seed Data)

Since there is no database, `lib/dummy-data.ts` is the source of all initial state. The `SmartPMProvider` initializes its `useRef` and `useState` with these values on mount.

### Seed Data Schema

**Tasks** include full `statusHistory` arrays simulating realistic sprint activity — tasks moving through columns, being assigned and reassigned, tracked hours accumulating.

**Sprints** include:
- Past sprints (status: `"closed"`) with completed task sets
- One active sprint (status: `"active"`)
- Future sprints (status: `"future"`)

**Goals** cover different time horizons (Q1–Q4) with varied statuses to exercise forecasting logic.

**Blockers** include both resolved and unresolved entries to demonstrate the analytics panel.

### Important Note on Persistence

**Changes made in the app do not persist across browser refreshes.** The state is entirely in-memory React state. Each page load re-initializes from `dummy-data.ts`.

---

## 14. Analytics Engine

The analytics pipeline runs client-side in the browser. Data flows:

```
dummy-data.ts (seed)
    → SmartPMProvider (React state)
    → useMemo: compute TeamLoad, Blockers, Risk per task
    → Build SprintContext (pre-computed metrics)
    → Pass to analytics page OR serialize for AI
```

### Burndown Chart

`burndown(sprint, tasks, today)` returns one `BurndownPoint` per sprint day:

```typescript
interface BurndownPoint {
  date: string;          // YYYY-MM-DD
  ideal: number;         // Linear ideal remaining points
  actual: number | null; // Actual remaining points (null for future dates)
}
```

Actual remaining = `plannedPoints - pointsCompleted(by that date)`.

### Velocity Trend

`sprintVelocity()` is called for each past sprint to build a historical velocity array. Used to forecast future sprint capacity.

### Estimation Accuracy

```typescript
// ratio < 0.8 → "under" (teams finish faster than estimated)
// ratio 0.8–1.2 → "on" (accurate)
// ratio > 1.2 → "over" (teams take longer than estimated)
```

### Milestone Forecast

`milestoneForecast()` uses a lookback window of past sprint velocities to project whether there are enough points of capacity remaining to complete all unfinished tasks linked to a goal before its `targetDate`.

---

## 15. Drag-and-Drop System

Built on `@dnd-kit` with the following structure:

### Setup

```tsx
<DndContext
  sensors={sensors}        // PointerSensor with 5px activation constraint
  collisionDetection={closestCorners}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  {/* 5 Column components, each wrapped in Droppable */}
  {/* DragOverlay for the floating card during drag */}
</DndContext>
```

### Sensors

`PointerSensor` with `activationConstraint: { distance: 5 }` — requires 5px of pointer movement before drag activates (prevents accidental drags on click).

### Columns as Drop Targets

Each `Column` component uses `useDroppable({ id: status })`. When a task card is dragged over a column, the column highlights.

### Task Cards as Drag Sources

Each `TaskCard` uses `useSortable({ id: task.id })`. Within a column, cards can be reordered. Between columns, the drop changes the task's `status`.

### Drag End Logic

```typescript
function handleDragEnd({ active, over }) {
  if (!over) return;  // Dropped outside any column

  const sourceStatus = active.data.current.status;
  const targetStatus = /* resolved from over.id or over.data.current.status */;
  const targetIndex = /* index within target column */;

  if (sourceStatus !== targetStatus) {
    // Cross-column: update status + append StatusTransition
  }
  moveTask(active.id, targetStatus, targetIndex);
}
```

---

## 16. Theming & Styling

### CSS Architecture

The project uses **Tailwind v4** with CSS custom properties. All design tokens are defined as CSS variables in `app/globals.css`.

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand: var(--brand);
  --color-risk-on-track: var(--risk-on-track);
  --color-risk-at-risk: var(--risk-at-risk);
  --color-risk-overdue: var(--risk-overdue);
}
```

### Custom Color Tokens

| Token | Usage |
|---|---|
| `--color-brand` | Primary action color (AI button, active nav) |
| `--color-risk-on-track` | Green — tasks on schedule |
| `--color-risk-at-risk` | Amber — tasks at risk |
| `--color-risk-overdue` | Red — overdue tasks |
| `--color-background` | Page background |
| `--color-foreground` | Primary text |
| Sidebar tokens | `--sidebar-ring`, etc. |

### Light / Dark Mode

Managed by `next-themes`. The `ThemeProvider` wraps the app in `layout.tsx`. Dark mode uses the `.dark` class on `<html>`. CSS custom properties have separate light/dark values.

### Font

Geist font family (from Vercel) — loaded via `next/font/google` in `layout.tsx`. Both sans and mono variants loaded. CSS variable `--font-geist-mono` used for code/monospace contexts.

### `cn()` Utility

All components use the `cn()` helper from `lib/utils.ts`:

```typescript
// Example usage in a component:
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "ghost" && "ghost-classes"
)} />
```

---

## 17. Data Flow Diagrams

### User Moves a Task (Drag-and-Drop)

```
User drags TaskCard to new column
    → DndContext.onDragEnd fires
    → Resolves targetStatus + targetIndex
    → Calls context.moveTask(taskId, targetStatus, targetIndex)
    → SmartPMProvider.moveTask():
        - Updates task.status in allTasks ref
        - Appends StatusTransition { kind: "status", from, to, at: today }
        - Updates lastStatusChangeAt
        - Triggers re-render (version counter)
    → All components using useSmartPM() re-render with new task state
    → KanbanBoard re-groups tasks by status
    → UI reflects new column placement
```

### User Sends AI Chat Message

```
User types message + presses Enter
    → ChatPanel.handleSend()
    → Appends { role: "user", content } to chatMessages
    → Builds SprintContext (serializes state + metrics)
    → POST /api/chat { messages, context }
        → Server: chatSystemPrompt(context) + message history
        → Azure OpenAI streams response (gpt-5.4)
        → Server parses NDJSON events
        → Returns streamed NDJSON to client
    → Client reads stream line by line:
        - { type: "text" } → append to streamingContent
        - { type: "tool_call" } → add ToolCallProposal to message
        - { type: "done" } → finalize message in chatMessages
    → ChatThread re-renders with new message + ToolCallCards
```

### User Confirms AI Tool Call

```
User clicks "Confirm" on ToolCallCard
    → ToolCallCard.onConfirm()
    → Identify ToolName from proposal
    → Execute corresponding context mutation:
        "update_task_status" → context.updateTaskStatus(taskId, status)
        "create_task" → context.addTask(draft)
        "reassign_task" → context.updateTaskAssignee(taskId, memberId)
        etc.
    → Mark proposal status as "confirmed" with result message
    → KanbanBoard updates immediately (shared state)
    → Toast notification shown via sonner
```

### Sprint Summary Generation

```
User clicks "Generate Summary"
    → SummaryModal.handleGenerate()
    → Builds SprintContext
    → POST /api/summary { context }
        → Server: summarySystemPrompt(context)
        → Azure OpenAI generates JSON (gpt-5.4, temp 0.3)
        → Server parses JSON from response
        → Returns SummaryReport JSON
    → SummaryModal shows SummaryReport component
    → Verdict, KPIs, blockers, risks, recommendations displayed
```

---

## 18. Key Architectural Decisions

### 1. React Context for State (No External Library)

**Decision:** Single React Context with all state + mutations.

**Why:** For a demo app of this scale, a global Context avoids the overhead of Redux/Zustand setup while keeping state accessible from any component. The trade-off is potential performance issues at larger scales (every context consumer re-renders), mitigated here by `useMemo` for derived values.

**Alternative considered:** Zustand — would be preferable for production use.

---

### 2. No Database — Seed Data Only

**Decision:** All data lives in `lib/dummy-data.ts` and in-memory React state.

**Why:** Demo/prototype scope. No backend infrastructure needed. Changes are ephemeral — each refresh resets to seed state.

**Implication:** Cannot persist user-created tasks, assignments, or chat history across sessions. For a production version, this would be replaced with a database (e.g., PostgreSQL via Prisma, or Supabase).

---

### 3. Dual AI Model Deployment Tiers

**Decision:** Two Azure OpenAI deployments — HEAVY (gpt-5.4) and NANO (gpt-4.1-mini).

**Why:** Different tasks have different quality/cost requirements. The HEAVY model is used for all current routes (chat, summary, explain). NANO is configured but not yet wired to any route — intended for simple/quick operations.

---

### 4. Human-in-the-Loop for AI Mutations

**Decision:** AI proposes actions via tool calls; user must confirm before state changes.

**Why:** Prevents the AI from making unintended mutations. Maintains user trust and control. Aligns with "AI as co-pilot, not autopilot" design philosophy.

---

### 5. Pre-Computed Analytics in AI Context

**Decision:** Compute all analytics client-side before sending to AI; embed results in system prompt.

**Why:** Reduces AI computation errors. GPT models can miscalculate statistics. Pre-computing ensures the AI cites accurate numbers. Also reduces prompt engineering burden.

---

### 6. NDJSON Streaming

**Decision:** Use Newline-Delimited JSON for streaming API responses instead of Server-Sent Events or WebSockets.

**Why:** Simpler implementation with standard `fetch` + `ReadableStream`. Works over HTTP/1.1 and HTTP/2. Supports structured event types (text delta, tool_call, done, error) without an SSE client library.

---

### 7. Status Transition History

**Decision:** Every status change is appended to `task.statusHistory`.

**Why:** Enables analytics like cycle time calculation, reopened task detection, and scope creep analysis. Without this audit trail, only the current state would be visible.

---

### 8. Dependency Cycle Prevention (DFS)

**Decision:** Client-side DFS before adding any task dependency.

**Why:** A circular dependency (A → B → A) would create an impossible state where both tasks block each other. Detected at mutation time with a meaningful error message.

---

## 19. Build, Dev & Deployment

### NPM Scripts

```bash
npm run dev      # Start Next.js dev server (http://localhost:3000)
npm run build    # Compile TypeScript + build optimized production bundle
npm run start    # Serve production build (requires prior npm run build)
npm run lint     # Run ESLint across all .ts/.tsx files
```

### Development Workflow

```bash
cd /path/to/SmartPM
npm install           # or: bun install
cp .env.example .env.local
# Fill in AZURE_OPENAI_* values in .env.local
npm run dev
# Open http://localhost:3000
```

### Production Build

Next.js compiles TypeScript via SWC (not tsc). The `tsconfig.json` has `"noEmit": true` — TypeScript is type-checking only. Build output goes to `.next/`.

### Deployment to Vercel

The project is Vercel-ready:
- No special configuration needed beyond env variables
- `.gitignore` includes `.vercel`
- `app/` directory structure is natively supported by Vercel's Next.js integration

**Required Vercel environment variables:**
```
AZURE_OPENAI_API_KEY
AZURE_OPENAI_API_INSTANCE_NAME
AZURE_OPENAI_API_VERSION
AZURE_OPENAI_DEPLOYMENT_HEAVY
AZURE_OPENAI_DEPLOYMENT_NANO (optional)
```

### Bundle Notes

- 584 npm packages in `node_modules`
- `recharts` and `@dnd-kit` are the heaviest client-side dependencies
- Azure OpenAI SDK is server-only (API routes) — not bundled into client JS

---

## 20. Known Gaps & Future Work

| Gap | Current State | Future Solution |
|---|---|---|
| **No persistence** | Data resets on refresh | PostgreSQL + Prisma ORM |
| **No authentication** | Open demo | NextAuth.js / Clerk |
| **No real-time sync** | Local state only | WebSockets / Supabase Realtime |
| **NANO deployment unused** | Defined but not wired | Wire to lightweight task endpoints |
| **No file attachments** | Tasks are text-only | S3/Blob storage integration |
| **No notifications** | No alerts | Push notifications or email alerts |
| **Sprint planning** | View only | Drag tasks between future sprints |
| **Mobile responsiveness** | Desktop-optimized | Responsive sidebar + touch drag |
| **Chart accessibility** | SVG only | ARIA labels, data tables |
| **Multi-user** | Single user | User accounts + role permissions |

---

## 21. Glossary

| Term | Definition |
|---|---|
| **App Router** | Next.js 13+ routing system using the `app/` directory and React Server Components |
| **Azure OpenAI** | Microsoft's managed deployment of OpenAI models, accessed via an Azure endpoint |
| **Backlog** | First Kanban column — tasks not yet started |
| **BlockerLog** | A detected obstruction: either a stalled task or a dependency on an unfinished task |
| **Burndown Chart** | Line chart showing ideal vs actual remaining story points over a sprint |
| **Context (React)** | React's built-in global state mechanism, used here instead of Redux/Zustand |
| **Cycle Time** | Days from task creation to completion (done status) |
| **DFS** | Depth-First Search — algorithm used for cycle detection in task dependency graph |
| **dnd-kit** | Lightweight drag-and-drop library for React |
| **Fibonacci Scale** | Story points use 1,2,3,5,8 — Fibonacci numbers used in agile estimation |
| **Gini Coefficient** | Statistical measure of inequality; used here for workload imbalance scoring |
| **Goal** | A project objective (OKR-style) that tasks can be linked to |
| **Heavy Model** | gpt-5.4 Azure deployment used for reasoning-intensive tasks |
| **Kanban** | Project management method using columns to represent workflow stages |
| **Milestone** | A `Goal` with `kind: "milestone"` — a specific deliverable with a target date |
| **Nano Model** | gpt-4.1-mini — lightweight, faster, cheaper model for simple tasks |
| **NDJSON** | Newline-Delimited JSON — streaming format where each line is a JSON object |
| **OKR** | Objectives and Key Results — goal-setting framework |
| **PM** | Project Manager |
| **React Context** | See Context (React) |
| **RSC** | React Server Component — renders on server, no client-side JS |
| **shadcn/ui** | Component library built on Radix UI / base-ui primitives with Tailwind styling |
| **Sprint** | A time-boxed iteration (typically 1–2 weeks) containing a set of tasks |
| **SprintContext** | Serialized state object sent to AI API routes with all sprint data + pre-computed metrics |
| **Status Transition** | A recorded event when a task changes status, assignee, or sprint |
| **Story Points** | Abstract estimation units (1/2/3/5/8) representing task complexity |
| **SummaryReport** | Structured JSON output from `/api/summary` — sprint health verdict + metrics |
| **Tool Call** | AI function-calling — AI proposes an action; user confirms before execution |
| **ToolCallProposal** | Frontend representation of a pending AI tool call with confirm/reject state |
| **Velocity** | Story points completed in a sprint — used for capacity forecasting |
| **Weekly Capacity Points** | Max story points a team member can handle per week |

---

*Last updated: 2026-06-02 | SmartPM v0.1.0 | Generated for university internship documentation*
