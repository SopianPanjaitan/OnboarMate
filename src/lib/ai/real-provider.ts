/**
 * OpenAI-compatible AI provider.
 * Used only when OPENAI_API_KEY (or OPENAI_COMPATIBLE_API_KEY) is configured
 * server-side. API keys are never sent to the browser.
 *
 * Compatible with OpenAI, Azure OpenAI, and any OpenAI-spec API
 * (Groq, Together, etc.) by setting OPENAI_COMPATIBLE_BASE_URL.
 */

import type { ChatMessage, ChatResponse, Citation } from "./types";
import { callTool, TOOL_DEFINITIONS, type ToolName } from "./tools";
import { DEMO_EMPLOYEE } from "@/lib/fixtures/nexora-data";

const SYSTEM_PROMPT = `You are OnboardMate, an AI-powered onboarding assistant for ${DEMO_EMPLOYEE.name} at Nexora Technologies (a fictional demonstration company).

You help the employee understand company policies, complete onboarding tasks, and find information from the knowledge base.

IMPORTANT RULES:
- Always respond in Indonesian (Bahasa Indonesia) unless the user writes in English.
- Use the available tools to fetch current data before answering about progress, tasks, or company documents.
- After calling a tool, synthesize the results into a helpful, conversational answer.
- When citing a document, include its title and version number.
- Never invent policy details — only use information from tool results.
- If a question is outside your knowledge, say so clearly and suggest HR contact.
- Keep responses concise and actionable.
- All data is fictional demonstration content — never present as real.

The current employee:
- Name: ${DEMO_EMPLOYEE.name}
- Department: ${DEMO_EMPLOYEE.department}  
- Job Title: ${DEMO_EMPLOYEE.jobTitle}
- Start Date: ${DEMO_EMPLOYEE.startDate}
- Mentor: ${DEMO_EMPLOYEE.mentorName}`;

interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
}

interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters?: {
      type: "object";
      properties: Record<string, { type: string; description: string }>;
      required?: string[];
    };
  };
}

function buildOpenAITools(): OpenAITool[] {
  return TOOL_DEFINITIONS.map((t): OpenAITool => ({
    type: "function" as const,
    function:
      t.name === "search_knowledge_base"
        ? {
            name: t.name,
            description: t.description,
            parameters: {
              type: "object" as const,
              properties: {
                query: {
                  type: "string",
                  description: "The search query to find relevant knowledge documents",
                },
              },
              required: ["query"],
            },
          }
        : {
            name: t.name,
            description: t.description,
            parameters: {
              type: "object" as const,
              properties: {} as Record<string, { type: string; description: string }>,
              required: [],
            },
          },
  }));
}

export async function realAIResponse(messages: ChatMessage[]): Promise<ChatResponse> {
  const apiKey =
    process.env.OPENAI_API_KEY ?? process.env.OPENAI_COMPATIBLE_API_KEY;
  const baseUrl =
    process.env.OPENAI_COMPATIBLE_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) throw new Error("No AI API key configured");

  const openAIMessages: OpenAIMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const tools = buildOpenAITools();
  const toolsUsed: string[] = [];
  const allCitations: Citation[] = [];

  // Agentic loop: allow up to 3 tool call rounds
  for (let round = 0; round < 3; round++) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openAIMessages,
        tools,
        tool_choice: "auto",
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`AI API error ${res.status}: ${err}`);
    }

    const json = (await res.json()) as {
      choices: Array<{
        message: OpenAIMessage;
        finish_reason: string;
      }>;
    };

    const choice = json.choices[0];
    const assistantMsg = choice.message;

    // No tool calls — return final answer
    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      return {
        content: assistantMsg.content ?? "",
        citations: allCitations,
        isAI: true,
        toolsUsed,
      };
    }

    // Process tool calls
    openAIMessages.push(assistantMsg);

    for (const tc of assistantMsg.tool_calls) {
      const toolName = tc.function.name as ToolName;
      let args: Record<string, string> = {};
      try {
        args = JSON.parse(tc.function.arguments) as Record<string, string>;
      } catch {
        // ignore parse errors
      }

      const result = callTool(toolName, args);
      toolsUsed.push(toolName);

      // Extract citations from knowledge search results
      if (toolName === "search_knowledge_base") {
        const data = result.data as {
          results: Array<{ id: string; title: string; version: number }>;
        };
        for (const r of data.results ?? []) {
          if (!allCitations.find((c) => c.documentId === r.id)) {
            allCitations.push({ documentId: r.id, title: r.title, version: r.version });
          }
        }
      }

      openAIMessages.push({
        role: "tool",
        content: JSON.stringify(result.data),
        tool_call_id: tc.id,
      });
    }
  }

  return {
    content:
      "Maaf, terjadi masalah saat memproses permintaan Anda. Silakan coba lagi.",
    citations: allCitations,
    isAI: true,
    toolsUsed,
  };
}
