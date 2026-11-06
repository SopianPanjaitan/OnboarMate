import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest, ChatResponse } from "@/lib/ai/types";
import { mockAIResponse } from "@/lib/ai/mock-provider";
import { realAIResponse } from "@/lib/ai/real-provider";

/**
 * POST /api/ai/chat
 *
 * Server-side AI chat endpoint.
 * - Uses real OpenAI-compatible API when OPENAI_API_KEY is set.
 * - Falls back to deterministic mock when no key is configured.
 * - API keys are never exposed to the client.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json(
      { content: "Invalid request", citations: [], isAI: false },
      { status: 400 }
    );
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { content: "Messages array is required", citations: [], isAI: false },
      { status: 400 }
    );
  }

  // Sanitize: only allow user/assistant roles, string content, max 20 messages
  const sanitized = messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
    )
    .slice(-20);

  const hasRealKey =
    !!process.env.OPENAI_API_KEY || !!process.env.OPENAI_COMPATIBLE_API_KEY;

  try {
    const response = hasRealKey
      ? await realAIResponse(sanitized)
      : await mockAIResponse(sanitized);

    return NextResponse.json(response);
  } catch (err) {
    console.error("[AI Chat] Error:", err);
    // On real AI failure, fall back to mock
    if (hasRealKey) {
      try {
        const fallback = await mockAIResponse(sanitized);
        return NextResponse.json({ ...fallback, isAI: false });
      } catch {
        // ignore
      }
    }
    return NextResponse.json(
      {
        content:
          "Maaf, terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
        citations: [],
        isAI: false,
      },
      { status: 500 }
    );
  }
}
