<div align="center">

# 🧠 SmartPM

### The AI-native project manager that *does the work*, not just tracks it.

A Kanban sprint board with an embedded agentic assistant that reads your full sprint context and takes action — creating tasks, reassigning work, wiring up dependencies, and moving items between sprints — all after a one-click confirmation.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Azure OpenAI" src="https://img.shields.io/badge/Azure_OpenAI-GPT-0078D4?logo=microsoftazure&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/status-prototype-orange" />
</p>

</div>

---

## ✨ Why SmartPM?

Most PM tools make *you* the engine — you drag the cards, you assign the people, you chase the blockers. SmartPM flips that. The assistant understands the entire board state and proposes concrete mutations you can approve in a single tap.

> **"Move every blocked task in Sprint 3 to the backlog and reassign Maria's overdue work to whoever has the least load."**
>
> SmartPM reads the sprint, drafts the exact changes, and waits for your confirmation. ✅

---

## 🚀 Features

| | Feature | What it does |
|---|---|---|
| 🗂️ | **Kanban Sprint Board** | Smooth drag-and-drop across 5 columns (Backlog → Done), powered by `@dnd-kit` |
| 🤖 | **Agentic AI Assistant** | A GPT-powered PM that reads sprint context and proposes **8 real actions** before executing |
| 📊 | **Live Analytics** | Burndown charts, velocity trends, team load, and estimation accuracy via Recharts |
| 🚨 | **Risk & Blocker Detection** | Auto-flags stalled tasks, overdue items, and dependency blocks |
| 👥 | **Team & Resource Management** | Global employee pool, per-project memberships, and capacity planning |
| 🔀 | **Multi-Project Support** | Switch between projects with fully isolated state |
| 🌗 | **Light / Dark Mode** | Themed end-to-end with `next-themes` |
| 📝 | **AI Summaries & Explanations** | One-click sprint summaries and "explain this task" insights |

---

## 🛠️ The AI Can Actually Do These

The assistant isn't a chatbot bolted on the side — it's wired to real tools. Every action is **proposed first, executed only on confirmation**:

```
✓ update_task_status      ✓ move_task_to_sprint
✓ reassign_task           ✓ create_task
✓ unassign_task           ✓ set_task_goals
✓ add_task_dependency     ✓ remove_task_dependency
```

---

## 🧱 Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com) (base-ui primitives)
- **Drag & Drop** — `@dnd-kit/core` + `@dnd-kit/sortable`
- **Charts** — Recharts 3
- **AI** — Azure OpenAI (`openai` SDK) with a heavy + nano model split
- **Icons** — Lucide
- **Toasts** — Sonner

---

## ⚡ Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd SmartPM
npm install
```

### 2. Configure environment

Copy the example env file and fill in your Azure OpenAI credentials:

```bash
cp .env.example .env.local
```

```env
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_API_INSTANCE_NAME=your-instance-name
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_HEAVY=your-heavy-deployment   # e.g. gpt-5.4 — chat & reasoning
AZURE_OPENAI_DEPLOYMENT_NANO=your-nano-deployment     # lightweight summaries
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start managing. 🎉

> **Note:** SmartPM runs on in-memory seed data — no database required. Perfect for demos and exploration.

---

## 📁 Project Structure

```
SmartPM/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Kanban board (home)
│   ├── analytics/            # Analytics dashboard
│   ├── team/  resources/     # Team & resource management
│   └── api/                  # chat · summary · explain endpoints
├── components/
│   ├── board/                # Kanban: columns, task cards, modals
│   ├── chat/                 # AI chat panel, tool-call cards, prompt book
│   ├── analytics/            # KPI cards & charts
│   ├── team/  resources/     # People management UIs
│   ├── layout/  providers/   # Shell, boot gate, global state
│   └── ui/                   # shadcn/ui primitives
└── lib/                      # AI clients, chat tools, prompts, seed data
```

---

## 🐳 Docker

A `Dockerfile` is included for containerized deployment:

```bash
docker build -t smartpm .
docker run -p 3000:3000 --env-file .env.local smartpm
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## 🗺️ Status & Roadmap

SmartPM is a **working prototype** built to demonstrate AI-augmented project management. Current state uses in-memory seed data with no auth.

**Planned:** persistent backend · authentication · real-time collaboration · richer agent toolset.

---

<div align="center">

Built with ⚡ Next.js, 🧠 Azure OpenAI, and a lot of ☕

</div>
# smartPM
# smartPM
