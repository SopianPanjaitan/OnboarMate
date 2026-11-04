"use client";

import React, { useState } from "react";
import { Bot, Send, User, Info, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ⚠️ All conversation content is synthetic demo data for Nexora Technologies (fictional organization)
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; version: number; section?: string }[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Halo! Saya OnboardMate, asisten AI untuk onboarding Anda di Nexora Technologies. Saya dapat membantu Anda memahami dokumen kebijakan, prosedur, dan status onboarding Anda. Ada yang bisa saya bantu?",
    citations: [],
  },
];

const demoSuggestions = [
  "Apa kebijakan cuti tahunan di Nexora?",
  "Bagaimana cara setup VPN?",
  "Siapa kontak HR saya?",
  "Apa yang harus saya selesaikan minggu ini?",
];

// Static demo responses — real AI in Phase 6
const demoResponse: Message = {
  id: 99,
  role: "assistant",
  content:
    "Berdasarkan dokumen yang tersedia, karyawan Nexora Technologies mendapatkan 12 hari cuti tahunan per tahun, dihitung secara pro-rata dari tanggal bergabung. Pengajuan cuti dilakukan melalui portal HR minimal 3 hari kerja sebelumnya.\n\n*Catatan: Ini adalah data demo fiktif. AI sesungguhnya akan mencari dan mengutip dokumen aktual organisasi Anda di Phase 6.*",
  citations: [
    { title: "Employee Handbook v2", version: 2, section: "Section 4.2 — Leave Policy" },
  ],
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg, { ...demoResponse, id: Date.now() + 1 }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-brand-blue-light flex items-center justify-center">
          <Bot size={20} className="text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">AI Assistant</h2>
          <p className="text-xs text-text-muted">
            Nexora Technologies · Responds in Indonesian by default{" "}
            <span className="text-[10px]">[Demo — real AI in Phase 6]</span>
          </p>
        </div>
        <Badge variant="warning" className="ml-auto text-xs">UI Demo Only</Badge>
      </div>

      {/* Disclaimer */}
      <Card className="mb-4 bg-status-info-bg border-status-info border-opacity-30">
        <CardContent className="py-3 px-4 flex gap-2 items-start">
          <Info size={14} className="text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-status-info">
            This is a UI placeholder. Real AI integration (RAG pipeline, tool calls, citation validation) will be implemented in Phase 6. All responses shown are static demo content.
          </p>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === "assistant"
                ? "bg-brand-navy"
                : "bg-brand-blue"
            )}>
              {msg.role === "assistant" ? (
                <Bot size={14} className="text-white" />
              ) : (
                <User size={14} className="text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={cn(
              "max-w-[75%] rounded-lg px-4 py-3 text-sm",
              msg.role === "assistant"
                ? "bg-surface-white border border-surface-border text-text-primary"
                : "bg-brand-navy text-white"
            )}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-surface-border space-y-1">
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Sources</p>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-brand-blue">
                      <BookOpen size={10} />
                      <span>{c.title}</span>
                      <span className="text-text-muted">· v{c.version}</span>
                      {c.section && <span className="text-text-muted">· {c.section}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {demoSuggestions.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="text-xs bg-surface-white border border-surface-border rounded-full px-3 py-1.5 text-text-secondary hover:border-brand-blue hover:text-brand-blue transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan Anda… (Enter to send)"
          className="flex-1 min-h-[48px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
