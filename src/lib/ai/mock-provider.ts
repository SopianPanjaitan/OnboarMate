/**
 * Deterministic mock AI provider.
 * Used when no real AI API key is configured.
 * Responses are keyword-matched against the user's message and use
 * tool results for context. Clearly labeled as mock responses.
 */

import type { ChatMessage, ChatResponse, Citation } from "./types";
import { callTool, searchKnowledgeBase } from "./tools";
import { KNOWLEDGE_DOCUMENTS } from "@/lib/fixtures/nexora-data";

interface MockRule {
  patterns: RegExp[];
  tool?: "get_onboarding_progress" | "list_pending_tasks" | "search_knowledge_base";
  searchQuery?: string;
  buildResponse: (toolData: unknown) => { content: string; citations: Citation[] };
}

const RULES: MockRule[] = [
  // Progress / status queries
  {
    patterns: [/progress|selesai|berapa.*task|sudah.*selesai|onboarding.*status/i],
    tool: "get_onboarding_progress",
    buildResponse(data) {
      const d = data as ReturnType<typeof import("./tools").getOnboardingProgress>["data"];
      const td = d as {
        progressPercent: number; completedTasks: number; totalTasks: number;
        currentStage: string;
        inProgressTasks: Array<{ title: string; dueDate: string }>;
        nextPendingTasks: Array<{ title: string; dueDate: string; stage: string }>;
      };
      const inProgList = td.inProgressTasks
        .map((t: { title: string; dueDate: string }) => `• ${t.title} (due ${t.dueDate})`)
        .join("\n");
      const nextList = td.nextPendingTasks
        .slice(0, 2)
        .map((t: { title: string; dueDate: string }) => `• ${t.title} (due ${t.dueDate})`)
        .join("\n");
      return {
        content: `Berdasarkan data onboarding Anda, berikut progres terkini:\n\n**${td.progressPercent}%** selesai — ${td.completedTasks} dari ${td.totalTasks} task.\n\nStage saat ini: **${td.currentStage}**\n\n**Sedang dikerjakan:**\n${inProgList}\n\n**Berikutnya:**\n${nextList}`,
        citations: [],
      };
    },
  },

  // Pending tasks
  {
    patterns: [/task.*pending|belum.*selesai|harus.*selesai.*minggu|deadline|due/i],
    tool: "list_pending_tasks",
    buildResponse(data) {
      const d = data as { totalPending: number; tasks: Array<{ title: string; dueDate: string; status: string; required: boolean }> };
      const urgentTasks = d.tasks.filter((t) => t.required).slice(0, 4);
      const list = urgentTasks
        .map((t) => `• **${t.title}** — due ${t.dueDate} ${t.required ? "(Wajib)" : ""}`)
        .join("\n");
      return {
        content: `Anda memiliki **${d.totalPending} task** yang belum selesai. Berikut yang paling penting:\n\n${list}\n\nSegera selesaikan task wajib (required) terlebih dahulu.`,
        citations: [],
      };
    },
  },

  // Leave / cuti
  {
    patterns: [/cuti|leave|libur|izin|absen/i],
    tool: "search_knowledge_base",
    searchQuery: "leave annual sick",
    buildResponse(data) {
      const d = data as { results: Array<{ id: string; title: string; version: number; excerpt: string }> };
      const doc = d.results[0];
      return {
        content: `Berdasarkan kebijakan Nexora Technologies:\n\n**Cuti Tahunan:** 12 hari kerja per tahun, dihitung pro-rata dari tanggal bergabung.\n\n**Cuti Sakit:** Hingga 14 hari per tahun. Untuk absen >2 hari berturut-turut, diperlukan surat dokter.\n\nPengajuan cuti dilakukan melalui HR portal minimal 3 hari kerja sebelumnya.\n\n${doc ? `*Detail lengkap: lihat ${doc.title}.*` : ""}`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "Leave Policy" }]
          : [],
      };
    },
  },

  // VPN / security
  {
    patterns: [/vpn|tailscale|jaringan|network|remote.*access/i],
    tool: "search_knowledge_base",
    searchQuery: "VPN tailscale network",
    buildResponse(data) {
      const d = data as { results: Array<{ id: string; title: string; version: number }> };
      const doc = d.results[0];
      return {
        content: `Untuk mengakses resource internal Nexora dari luar kantor, gunakan **Tailscale VPN**:\n\n1. Email ke helpdesk@nexora.demo dengan subject "Tailscale access request" dan ID karyawan Anda.\n2. Download Tailscale dari tailscale.com.\n3. Login dengan akun Google Nexora.\n4. Setelah disetujui IT, connect melalui ikon Tailscale di taskbar/menu bar.\n5. Verifikasi: jalankan \`tailscale status\` di terminal.\n\nJangan pernah terhubung ke Wi-Fi publik tanpa VPN aktif.`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "VPN Setup" }]
          : [],
      };
    },
  },

  // HR contact
  {
    patterns: [/kontak|contact|hr.*siapa|siapa.*hr|menghubungi.*hr/i],
    tool: "search_knowledge_base",
    searchQuery: "HR contact Sarah",
    buildResponse() {
      const doc = KNOWLEDGE_DOCUMENTS.find((d) => d.id === "doc-005");
      return {
        content: `Berikut kontak penting di Nexora Technologies:\n\n• **HR:** Sarah Wulandari — sarah.w@nexora.demo — Slack: @sarah.w\n• **IT Support:** helpdesk@nexora.demo (SLA 4 jam)\n• **Payroll:** payroll@nexora.demo\n• **Mentor Anda:** Eko Wijaya — eko.w@nexora.demo — Slack: @eko.w\n\nUntuk pertanyaan umum, cek #general atau #onboarding-cohort-nov-2026 di Slack.`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "Key Contacts" }]
          : [],
      };
    },
  },

  // Setup / dev environment
  {
    patterns: [/setup|install|environment|dev.*env|development|clone|repo/i],
    tool: "search_knowledge_base",
    searchQuery: "development environment setup",
    buildResponse(data) {
      const d = data as { results: Array<{ id: string; title: string; version: number; excerpt: string }> };
      const doc = d.results[0];
      return {
        content: `Untuk setup environment development Anda:\n\n1. **Install tooling:** Homebrew → nvm → Node.js 20 → pnpm\n2. **Clone repo:** Minta akses GitHub org ke helpdesk, lalu clone platform & api repo.\n3. **Environment variables:** Copy \`.env.example\` ke \`.env.local\`, minta nilai aktualnya dari team lead via 1Password.\n4. **Database lokal:** \`npx supabase start\` lalu \`npx supabase db push\`.\n5. **Jalankan:** \`pnpm install\` → \`pnpm dev\` → buka http://localhost:3000\n\nKendala? Tanya di Slack channel **#dev-help**.`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "Setup Steps" }]
          : [],
      };
    },
  },

  // Password / security policy
  {
    patterns: [/password|kata.*sandi|security|keamanan|mfa|2fa/i],
    tool: "search_knowledge_base",
    searchQuery: "password security MFA",
    buildResponse(data) {
      const d = data as { results: Array<{ id: string; title: string; version: number }> };
      const doc = d.results[0];
      return {
        content: `Kebijakan keamanan IT Nexora Technologies:\n\n• **Password:** Minimal 16 karakter untuk sistem kritis, 12 untuk sistem lainnya.\n• **Password Manager:** Gunakan Bitwarden atau 1Password yang disediakan perusahaan.\n• **MFA:** Wajib diaktifkan di semua akun perusahaan.\n• **Perangkat:** Aktifkan enkripsi disk penuh (FileVault/BitLocker).\n• **Insiden:** Laporkan ke security@nexora.demo segera jika ada dugaan pelanggaran.`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "Password Policy" }]
          : [],
      };
    },
  },

  // Benefits
  {
    patterns: [/benefit|tunjangan|gaji|salary|asuransi|health|kesehatan|learning.*budget/i],
    tool: "search_knowledge_base",
    searchQuery: "benefits compensation health insurance",
    buildResponse(data) {
      const d = data as { results: Array<{ id: string; title: string; version: number }> };
      const doc = d.results[0];
      return {
        content: `Benefit karyawan Nexora Technologies:\n\n• **Asuransi kesehatan:** Ditanggung perusahaan untuk karyawan + 1 tanggungan.\n• **Tunjangan internet:** IDR 500.000/bulan (untuk karyawan remote-eligible).\n• **Learning budget:** IDR 5.000.000/tahun untuk kursus, konferensi, dan sertifikasi.\n• **Review gaji:** Setiap Januari.\n• **Klaim pengeluaran:** Melalui expenses.nexora.demo.`,
        citations: doc
          ? [{ documentId: doc.id, title: doc.title, version: doc.version, section: "Compensation & Benefits" }]
          : [],
      };
    },
  },
];

// Default fallback response when no rule matches
function buildFallback(userMessage: string): { content: string; citations: Citation[] } {
  // Try a broad knowledge search anyway
  const searchResult = searchKnowledgeBase(userMessage.slice(0, 60));
  const results = (searchResult.data as { results: Array<{ id: string; title: string; version: number }> }).results;

  if (results.length > 0) {
    const docList = results
      .map((r) => `• ${r.title} (v${r.version})`)
      .join("\n");
    return {
      content: `Saya menemukan beberapa dokumen yang mungkin relevan dengan pertanyaan Anda:\n\n${docList}\n\nUntuk pertanyaan yang lebih spesifik, silakan tanya ulang dengan kata kunci yang lebih detail, atau hubungi HR di sarah.w@nexora.demo.`,
      citations: results.slice(0, 2).map((r) => ({
        documentId: r.id,
        title: r.title,
        version: r.version,
      })),
    };
  }

  return {
    content: `Maaf, saya tidak menemukan informasi yang cukup spesifik untuk menjawab pertanyaan tersebut dari dokumen yang tersedia.\n\nAnda bisa:\n• Coba tanyakan dengan kata kunci yang berbeda\n• Cek **Knowledge Center** untuk dokumen lengkap\n• Hubungi HR: sarah.w@nexora.demo\n\nSaya siap membantu topik seperti: cuti, setup environment, kebijakan keamanan, kontak HR, atau progress onboarding Anda.`,
    citations: [],
  };
}

// Small artificial delay to make the demo feel natural
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockAIResponse(messages: ChatMessage[]): Promise<ChatResponse> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return { content: "Ada yang bisa saya bantu?", citations: [], isAI: false };
  }

  const userText = lastUser.content;

  // Simulate processing delay (600–1400ms)
  await delay(600 + Math.random() * 800);

  // Try rules in order
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(userText))) {
      const toolData = rule.tool
        ? callTool(
            rule.tool,
            rule.searchQuery ? { query: rule.searchQuery } : undefined
          ).data
        : null;

      const { content, citations } = rule.buildResponse(toolData);
      return {
        content,
        citations,
        isAI: false,
        toolsUsed: rule.tool ? [rule.tool] : [],
      };
    }
  }

  const { content, citations } = buildFallback(userText);
  return { content, citations, isAI: false, toolsUsed: ["search_knowledge_base"] };
}
