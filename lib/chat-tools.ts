import type { ChatCompletionTool } from "openai/resources/chat/completions";
import type { Status, ToolName } from "@/types";

export const STATUSES: Status[] = ["backlog", "todo", "in_progress", "in_review", "done"];

export const TOOL_DEFS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "update_task_status",
      description:
        "Move a task to a new status. Use this when the user asks you to mark a task as done, move it to in review, etc.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task to update." },
          status: {
            type: "string",
            enum: STATUSES,
            description: "The new status for the task.",
          },
        },
        required: ["taskId", "status"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "reassign_task",
      description: "Assign a task to a different team member. Use when the user wants to give a task to someone.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task to reassign." },
          memberId: { type: "string", description: "The team member id to assign the task to." },
        },
        required: ["taskId", "memberId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "unassign_task",
      description: "Remove the current assignee from a task, leaving it unassigned.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task to unassign." },
        },
        required: ["taskId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_task_dependency",
      description:
        "Declare that one task depends on another (i.e. cannot start/finish until the dependency is done). Use when the user asks to link tasks, or when proactive analysis surfaces a missing structural dependency. Cycles are rejected server-side.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task that will depend on another." },
          dependsOnTaskId: {
            type: "string",
            description: "The id of the task that must be done first.",
          },
        },
        required: ["taskId", "dependsOnTaskId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_task_dependency",
      description: "Remove an existing dependency edge between two tasks.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the dependent task." },
          dependsOnTaskId: {
            type: "string",
            description: "The id of the dependency to remove.",
          },
        },
        required: ["taskId", "dependsOnTaskId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_task_to_sprint",
      description:
        "Move an existing task from its current sprint into a different sprint within the active project. Use one call per task — for bulk operations (e.g. 'move all Sprint 3 tasks to Sprint 2'), emit one move_task_to_sprint call per matching task in the same response. The user will see one confirmation card per task.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task to move." },
          sprintId: {
            type: "string",
            description: "The id of the destination sprint. Must belong to the active project.",
          },
        },
        required: ["taskId", "sprintId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task",
      description:
        "Create a new task in the active project. Use when the user asks to add work that doesn't exist yet. You MUST resolve sprintId and assigneeId to ids from the JSON context — never invent. Sprint must belong to the active project. Choose sensible defaults if the user didn't specify (status: todo, priority: medium, storyPoints: 3, sprint: the currently active sprint).",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Short, action-oriented task title (5-10 words).",
          },
          description: {
            type: "string",
            description: "Optional longer description of the task scope.",
          },
          status: {
            type: "string",
            enum: STATUSES,
            description: "Initial status. Default 'todo' unless the user is explicit.",
          },
          assigneeId: {
            type: "string",
            description:
              "Team member id from the active project, or omit/empty for unassigned. Match the strongest team-profile fit per the team-profile rules.",
          },
          priority: {
            type: "string",
            enum: ["critical", "high", "medium", "low"],
            description: "Task priority. Default 'medium'.",
          },
          storyPoints: {
            type: "number",
            enum: [1, 2, 3, 5, 8],
            description: "Effort sizing on the standard fibonacci scale. Default 3.",
          },
          dueDate: {
            type: "string",
            description:
              "Due date in YYYY-MM-DD. Pick something reasonable inside the chosen sprint window if the user didn't specify.",
          },
          sprintId: {
            type: "string",
            description: "Sprint id this task lives in. Must belong to the active project.",
          },
          estimatedHours: {
            type: "number",
            description:
              "Optional initial estimate in hours. If the user gave a number, use it. Otherwise, estimate ~3-4h per story point, then nudge by the assignee's historical bias (e.g. +20% for a chronic over-estimator).",
          },
          dependsOn: {
            type: "array",
            items: { type: "string" },
            description: "Optional task ids this new task depends on. All must be in the active project.",
          },
        },
        required: ["title", "priority", "storyPoints", "dueDate", "sprintId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_task_goals",
      description:
        "Replace the list of goals/milestones a task contributes to. The provided goalIds array fully replaces the task's existing goalIds. Only call when the user explicitly asks to link or unlink a task to a goal — never for analytical questions.",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The id of the task to update." },
          goalIds: {
            type: "array",
            items: { type: "string" },
            description:
              "Full new list of goal ids. Pass an empty array to clear all goal links. All ids must belong to the active project.",
          },
        },
        required: ["taskId", "goalIds"],
        additionalProperties: false,
      },
    },
  },
];

export const TOOL_NAMES = new Set<ToolName>([
  "update_task_status",
  "reassign_task",
  "unassign_task",
  "add_task_dependency",
  "remove_task_dependency",
  "create_task",
  "move_task_to_sprint",
  "set_task_goals",
]);

export function isToolName(name: string): name is ToolName {
  return TOOL_NAMES.has(name as ToolName);
}
