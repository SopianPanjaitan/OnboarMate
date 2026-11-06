/**
 * Shared types for the AI assistant system.
 * Used by both the API route (server) and the client component.
 */

export interface Citation {
  documentId: string;
  title: string;
  version: number;
  section?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Demo employee context — never trust for auth, demo only */
  context?: {
    employeeName?: string;
    department?: string;
  };
}

export interface ChatResponse {
  content: string;
  citations: Citation[];
  /** True when the response came from a real AI provider */
  isAI: boolean;
  /** Tool calls the AI made (for display) */
  toolsUsed?: string[];
}

export interface ToolResult {
  toolName: string;
  data: unknown;
}
