"use client";

import { X } from "lucide-react";

interface Prompt {
  label: string;
  text: string;
}

interface Category {
  name: string;
  prompts: Prompt[];
}

const CATEGORIES: Category[] = [
  {
    name: "Sprint Health",
    prompts: [
      { label: "Full sprint health check", text: "Give me a complete sprint health check — completion rate, open blockers, stale tasks, and the single biggest risk right now." },
      { label: "Will we hit our sprint goal?", text: "Based on our current pace, blockers, and hours remaining — are we actually going to finish this sprint? Give me an honest read." },
      { label: "Burndown status", text: "What does our burndown tell us? Are we ahead or behind the ideal pace, and what's driving the gap?" },
      { label: "What's stale and why does it matter?", text: "Which tasks have been stuck in the same status for too long, and what's the likely cause and business impact of each?" },
      { label: "Days of work vs days remaining", text: "How many hours of estimated work are left in this sprint, and how does that compare to the calendar days and team capacity we have left?" },
      { label: "Biggest threat to finishing on time", text: "What's the single biggest threat to this sprint finishing on schedule, and what can I do about it today?" },
    ],
  },
  {
    name: "Delivery Risk",
    prompts: [
      { label: "All at-risk tasks ranked by impact", text: "List every task at risk of missing its deadline. Rank them by downstream impact so I know where to intervene first." },
      { label: "Overdue tasks blocking downstream work", text: "Which overdue tasks are blocking the most downstream dependencies? Give me the worst offenders and what's at stake." },
      { label: "High-priority tasks not yet started", text: "Are there any critical or high-priority tasks that haven't started yet and are due soon? Flag the most urgent ones." },
      { label: "What won't we ship if nothing changes?", text: "If we change nothing today, what specifically won't be delivered by sprint end? Be direct." },
      { label: "Which tasks need immediate attention?", text: "Which 3 tasks should I unblock or escalate today to prevent the most damage to the sprint?" },
    ],
  },
  {
    name: "Team & Workload",
    prompts: [
      { label: "Who is overloaded right now?", text: "Who on the team is overloaded this sprint and who has room to take on more? Give me the numbers." },
      { label: "Best person for unstarted work", text: "I need to assign high-priority unstarted tasks. Who has the most bandwidth and the right skills right now?" },
      { label: "Is workload distribution fair?", text: "Is our task distribution balanced across the team or is someone carrying too much? Flag any imbalance and suggest a fix." },
      { label: "Who's been most productive this sprint?", text: "Based on story points completed and task velocity, who has been the most productive team member this sprint?" },
      { label: "Team capacity for next sprint", text: "Based on our current team composition and weekly capacity, how many story points can we realistically plan for next sprint?" },
    ],
  },
  {
    name: "Planning & Estimation",
    prompts: [
      { label: "How accurate are our estimates?", text: "How accurate are our estimates overall — are we consistently over or under, and by how much?" },
      { label: "Who estimates most and least accurately?", text: "Which team members estimate closest to reality and who needs the most calibration? Show me the spread." },
      { label: "Buffer I should add for next sprint", text: "Based on our historical estimation bias, how much buffer should I build into the next sprint commitment?" },
      { label: "Velocity trend across sprints", text: "How has our sprint velocity trended across the last few sprints? Is it improving, declining, or flat, and what explains the pattern?" },
      { label: "Realistic commitment for next sprint", text: "Given our historical velocity and current team capacity, what's a realistic story point target for next sprint?" },
    ],
  },
  {
    name: "Goals & Alignment",
    prompts: [
      { label: "Backlog alignment with our goal", text: "What percentage of our backlog is linked to our current goal, and which tasks are consuming effort without contributing to it?" },
      { label: "Will we hit the milestone?", text: "Based on our last 3 sprints' velocity and remaining work, will we hit the upcoming milestone? Give me a date projection." },
      { label: "How many points per sprint do we need?", text: "How many story points do we need to complete per sprint to hit our goal on time? Compare that to our current velocity." },
      { label: "Unlinked backlog tasks", text: "Which backlog tasks have no goal linked — potential scope waste I should review before next sprint planning?" },
      { label: "Goal progress across all milestones", text: "Give me a status summary of all project goals and milestones — which are on track, which are at risk, and which we'll likely miss." },
    ],
  },
  {
    name: "Scope & Prioritization",
    prompts: [
      { label: "What got added mid-sprint?", text: "What tasks were added to this sprint after it started? Give me the list and tell me how much scope creep we're dealing with." },
      { label: "Cut candidates to pull in delivery", text: "If I need to pull in our delivery date by one week, which tasks are the best candidates to cut or defer? Show me what we'd free up." },
      { label: "Highest-impact backlog for next sprint", text: "Based on priority, story points, and goal alignment — which backlog items should I pull into next sprint first?" },
      { label: "Tasks reopened the most", text: "Which tasks have been reopened the most times, and what does that pattern suggest about quality or scope clarity?" },
      { label: "Easiest wins to close fast", text: "Which open tasks are low effort, high priority, and could realistically be closed before sprint end?" },
    ],
  },
  {
    name: "Reporting & Standups",
    prompts: [
      { label: "What did we ship this week?", text: "What did the team complete this week? Give me a crisp summary I can share with stakeholders." },
      { label: "Sprint status for leadership", text: "Draft a one-paragraph sprint status update suitable for a leadership report — what's done, what's at risk, and what we need." },
      { label: "Standup talking points for today", text: "What are the top 3 things I should raise in today's standup based on current sprint state?" },
      { label: "Risks to communicate upward", text: "What risks are significant enough to escalate to leadership or stakeholders right now? Give me the key points." },
      { label: "End-of-sprint retrospective input", text: "Based on this sprint's data, what went well, what slowed us down, and what should we improve in the next sprint?" },
    ],
  },
];

interface Props {
  onSelect: (text: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function PromptBook({ onSelect, onClose, disabled }: Props) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <div>
          <div className="text-sm font-semibold">Prompt Book</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Ready-to-send PM queries — click any to ask the AI
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded"
          aria-label="Close prompt book"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-5 overflow-y-auto pr-1">
        {CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {cat.name}
            </div>
            <div className="flex flex-col gap-1.5">
              {cat.prompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    onSelect(p.text);
                    onClose();
                  }}
                  disabled={disabled}
                  className="text-left text-sm px-3 py-2 rounded-md border border-border hover:border-brand hover:bg-accent/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
