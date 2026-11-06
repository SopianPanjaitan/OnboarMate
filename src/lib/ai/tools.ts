/**
 * Server-side AI tools — read-only demo implementations.
 * In production these would query the database with server-derived identity.
 * Here they operate on local fixtures (no external calls, no auth required).
 */

import {
  DEMO_TASKS,
  DEMO_PROGRESS,
  DEMO_EMPLOYEE,
  KNOWLEDGE_DOCUMENTS,
  type OnboardingTask,
  type KnowledgeDocument,
} from "@/lib/fixtures/nexora-data";
import type { ToolResult } from "./types";

// ---------------------------------------------------------------------------
// Tool: get onboarding progress
// ---------------------------------------------------------------------------

export function getOnboardingProgress(): ToolResult {
  const inProgress = DEMO_TASKS.filter((t) => t.status === "in_progress");
  const pending = DEMO_TASKS.filter((t) => t.status === "pending");

  return {
    toolName: "get_onboarding_progress",
    data: {
      employee: DEMO_EMPLOYEE.name,
      department: DEMO_EMPLOYEE.department,
      jobTitle: DEMO_EMPLOYEE.jobTitle,
      startDate: DEMO_EMPLOYEE.startDate,
      completedTasks: DEMO_PROGRESS.completed,
      totalTasks: DEMO_PROGRESS.total,
      progressPercent: DEMO_PROGRESS.percentage,
      currentStage: DEMO_PROGRESS.currentStage,
      inProgressTasks: inProgress.map((t: OnboardingTask) => ({
        title: t.title,
        dueDate: t.dueDate,
        required: t.required,
      })),
      nextPendingTasks: pending.slice(0, 3).map((t: OnboardingTask) => ({
        title: t.title,
        dueDate: t.dueDate,
        required: t.required,
        stage: t.stage,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Tool: list pending tasks
// ---------------------------------------------------------------------------

export function getPendingTasks(): ToolResult {
  const notDone = DEMO_TASKS.filter(
    (t) => t.status === "pending" || t.status === "in_progress" || t.status === "blocked"
  );

  return {
    toolName: "list_pending_tasks",
    data: {
      totalPending: notDone.length,
      tasks: notDone.map((t: OnboardingTask) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        stage: t.stage,
        status: t.status,
        dueDate: t.dueDate,
        required: t.required,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Tool: search knowledge base
// ---------------------------------------------------------------------------

export function searchKnowledgeBase(query: string): ToolResult {
  const q = query.toLowerCase();

  // Simple keyword scoring — no vector search needed for demo
  const scored = KNOWLEDGE_DOCUMENTS.map((doc: KnowledgeDocument) => {
    const titleMatch = doc.title.toLowerCase().includes(q) ? 3 : 0;
    const descMatch = doc.description.toLowerCase().includes(q) ? 2 : 0;
    const categoryMatch = doc.category.toLowerCase().includes(q) ? 1 : 0;
    const contentMatches = (doc.content.toLowerCase().match(new RegExp(q, "g")) || []).length;
    const score = titleMatch + descMatch + categoryMatch + contentMatches;
    return { doc, score };
  });

  const relevant = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    toolName: "search_knowledge_base",
    data: {
      query,
      results: relevant.map(({ doc }) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        version: doc.version,
        // Return the most relevant excerpt (first 600 chars if no better match)
        excerpt: extractExcerpt(doc.content, q),
      })),
    },
  };
}

function extractExcerpt(content: string, query: string): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx === -1) return content.slice(0, 400) + "…";
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + 400);
  const excerpt = content.slice(start, end);
  return (start > 0 ? "…" : "") + excerpt + (end < content.length ? "…" : "");
}

// ---------------------------------------------------------------------------
// Exported tool registry
// ---------------------------------------------------------------------------

export type ToolName =
  | "get_onboarding_progress"
  | "list_pending_tasks"
  | "search_knowledge_base";

export const TOOL_DEFINITIONS = [
  {
    name: "get_onboarding_progress" as ToolName,
    description:
      "Returns the authenticated employee's onboarding progress summary including completed tasks, current stage, and next items.",
  },
  {
    name: "list_pending_tasks" as ToolName,
    description:
      "Returns the employee's pending, in-progress, and blocked onboarding tasks with due dates.",
  },
  {
    name: "search_knowledge_base" as ToolName,
    description:
      "Searches the organization's published knowledge documents for content relevant to the query. Returns excerpts and document metadata.",
    parameters: { query: "string" },
  },
] as const;

export function callTool(name: ToolName, args?: Record<string, string>): ToolResult {
  switch (name) {
    case "get_onboarding_progress":
      return getOnboardingProgress();
    case "list_pending_tasks":
      return getPendingTasks();
    case "search_knowledge_base":
      return searchKnowledgeBase(args?.query ?? "");
    default:
      return { toolName: name, data: { error: "Unknown tool" } };
  }
}
