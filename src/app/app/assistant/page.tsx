"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, User, BookOpen, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatResponse, Citation } from "@/lib/ai/types";
import { AI_SUGGESTIONS, DEMO_EMPLOYEE } from "@/lib/fixtures/nexora-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isAI?: boolean;
  toolsUsed?: string[];
  isLoading?: boolean;
  isError?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  content: `Halo, ${DEMO_EMPLOYEE.name}! 👋 Saya **OnboardMate**, asisten AI onboarding Anda di Nexora Technologies.\n\nSaya dapat membantu Anda dengan:\n• Kebijakan dan prosedur perusahaan\n• Status dan task onboarding Anda\n• Setup environment development\n• Informasi kontak dan benefit\n\nAda yang bisa saya bantu hari ini?`,
  isAI: false,
};

const SUGGESTION_TABS = [
  { label: "Umum", key: "general" as const },
  { label: "Onboarding", key: "onboarding" as const },
  { label: "HR & Kebijakan", key: "hr" as const },
  { label: "Technical", key: "technical" as const },
] as const;

type SuggestionTab = (typeof SUGGESTION_TABS)[number]["key"];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-surface-white border border-surface-border rounded-lg px-4 py-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: UIMessage }) {
  const isAssistant = msg.role === "assistant";

  if (msg.isLoading) return <TypingIndicator />;

  return (
    <div className={cn("flex gap-3", !isAssistant && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          isAssistant ? "bg-brand-navy" : "bg-brand-blue"
        )}
      >
        {isAssistant ? (
          <Bot size={14} className="text-white" />
        ) : (
          <User size={14} className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
          isAssistant
            ? "bg-surface-white border border-surface-border text-text-primary rounded-tl-sm"
            : "bg-brand-navy text-white rounded-tr-sm",
          msg.isError && "border-status-error bg-status-error-bg text-status-error"
        )}
      >
        {/* Content with basic markdown bold support */}
        <div className="whitespace-pre-wrap leading-relaxed">
          {formatContent(msg.content)}
        </div>

        {/* Citations */}
        {isAssistant && msg.citations && msg.citations.length > 0 && (
          <div className="mt-3 pt-2 border-t border-surface-border space-y-1">
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide flex items-center gap-1">
              <BookOpen size={9} /> Sumber
            </p>
            {msg.citations.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-brand-blue">
                <BookOpen size={10} className="flex-shrink-0" />
                <span className="font-medium">{c.title}</span>
                <span className="text-text-muted">· v{c.version}</span>
                {c.section && (
                  <span className="text-text-muted">· {c.section}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tools used indicator */}
        {isAssistant && msg.toolsUsed && msg.toolsUsed.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted">
            <Sparkles size={9} />
            <span>
              {msg.isAI ? "AI" : "Demo"} ·{" "}
              {msg.toolsUsed.map((t) => t.replace(/_/g, " ")).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Render **bold** markdown in message content */
function formatContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AssistantPage() {
  const [messages, setMessages] = useState<UIMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SuggestionTab>("general");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);

      const userMsg: UIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const loadingMsg: UIMessage = {
        id: `loading-${Date.now()}`,
        role: "assistant",
        content: "",
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setInput("");
      setIsLoading(true);

      // Build history for the API (exclude loading/error messages)
      const history: ChatMessage[] = messages
        .filter((m) => !m.isLoading && !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));
      history.push({ role: "user", content: trimmed });

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: ChatResponse = await res.json() as ChatResponse;

        setMessages((prev) =>
          prev.map((m) =>
            m.isLoading
              ? {
                  id: `assistant-${Date.now()}`,
                  role: "assistant",
                  content: data.content,
                  citations: data.citations,
                  isAI: data.isAI,
                  toolsUsed: data.toolsUsed,
                  isLoading: false,
                }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.isLoading
              ? {
                  id: `error-${Date.now()}`,
                  role: "assistant",
                  content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.",
                  isError: true,
                  isLoading: false,
                }
              : m
          )
        );
        setError("Gagal menghubungi server. Periksa koneksi Anda.");
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const suggestions = AI_SUGGESTIONS[activeTab];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 flex-shrink-0">
        <div className="h-10 w-10 rounded-xl bg-brand-navy flex items-center justify-center shadow-sm">
          <Bot size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">OnboardMate AI</h2>
            <Badge variant="info" className="text-[10px]">
              Demo
            </Badge>
          </div>
          <p className="text-xs text-text-muted truncate">
            Nexora Technologies · {DEMO_EMPLOYEE.name} · {DEMO_EMPLOYEE.jobTitle}
            {" "}<span className="opacity-50">[Fictional demo data]</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted bg-surface-gray rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Demo mode notice */}
      <div className="mb-3 flex-shrink-0 bg-brand-blue-light border border-brand-blue-muted rounded-lg px-3 py-2 flex items-start gap-2">
        <Sparkles size={13} className="text-brand-blue mt-0.5 flex-shrink-0" />
        <p className="text-xs text-brand-blue">
          <span className="font-semibold">Demo Mode:</span> Menggunakan mock AI dengan data fiktif Nexora Technologies. Tambahkan{" "}
          <code className="bg-white/50 rounded px-1">OPENAI_API_KEY</code> di{" "}
          <code className="bg-white/50 rounded px-1">.env.local</code> untuk mengaktifkan AI sungguhan.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-3 flex-shrink-0 bg-status-error-bg border border-status-error rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertCircle size={13} className="text-status-error flex-shrink-0" />
          <p className="text-xs text-status-error">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="flex-shrink-0 mb-3">
        {/* Tabs */}
        <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
          {SUGGESTION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                activeTab === tab.key
                  ? "bg-brand-navy text-white"
                  : "bg-surface-white border border-surface-border text-text-secondary hover:border-brand-blue hover:text-brand-blue"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Suggestion chips */}
        <div className="flex gap-2 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => void sendMessage(s)}
              disabled={isLoading}
              className="text-xs bg-surface-white border border-surface-border rounded-full px-3 py-1.5 text-text-secondary hover:border-brand-blue hover:text-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan Anda… (Enter untuk kirim, Shift+Enter untuk baris baru)"
          className="flex-1 min-h-[48px] max-h-[120px] resize-none text-sm"
          rows={1}
          disabled={isLoading}
        />
        <Button
          onClick={() => void sendMessage(input)}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      </div>

      <p className="text-center text-[10px] text-text-muted mt-2 flex-shrink-0">
        Data Nexora Technologies adalah fiktif semata — tidak merepresentasikan organisasi nyata.
      </p>
    </div>
  );
}
