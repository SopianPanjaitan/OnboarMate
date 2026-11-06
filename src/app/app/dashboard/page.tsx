import React from "react";
import { CheckCircle, Clock, Bot, BookOpen, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DEMO_EMPLOYEE, DEMO_TASKS, DEMO_PROGRESS, KNOWLEDGE_DOCUMENTS } from "@/lib/fixtures/nexora-data";

// ⚠️ All data is synthetic demo content for Nexora Technologies (fictional organization)

const upcomingTasks = DEMO_TASKS.filter(
  (t) => t.status === "in_progress" || t.status === "pending"
).slice(0, 4);

const SAMPLE_PROMPTS = [
  "Apa kebijakan cuti tahunan saya?",
  "Task apa yang belum saya selesaikan minggu ini?",
  "Bagaimana cara setup VPN Tailscale?",
];

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Selamat datang, {DEMO_EMPLOYEE.name.split(" ")[0]} 👋
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {DEMO_PROGRESS.percentage}% onboarding selesai di Nexora Technologies ·{" "}
            {DEMO_EMPLOYEE.department} · {DEMO_EMPLOYEE.jobTitle}{" "}
            <span className="text-[10px] text-text-muted">[Demo — fictional]</span>
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/app/assistant" className="flex items-center gap-2">
            <Bot size={14} /> Tanya AI Assistant
          </Link>
        </Button>
      </div>

      {/* AI Assistant highlight card */}
      <Card className="bg-brand-navy text-white overflow-hidden relative">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">OnboardMate AI</p>
                  <p className="text-[11px] text-brand-blue-muted">Asisten onboarding Anda</p>
                </div>
              </div>
              <p className="text-sm text-brand-blue-muted mb-4 leading-relaxed">
                Tanyakan kebijakan perusahaan, cek progress onboarding, atau minta bantuan setup
                environment — asisten AI siap membantu.
              </p>
              {/* Sample prompts */}
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((p) => (
                  <Link
                    key={p}
                    href={`/app/assistant`}
                    className="text-[11px] bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-brand-blue-muted hover:text-white transition-colors"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="flex-shrink-0 border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/app/assistant" className="flex items-center gap-1.5">
                Mulai <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Progress Onboarding"
          value={`${DEMO_PROGRESS.percentage}%`}
          subtitle={`${DEMO_PROGRESS.completed} dari ${DEMO_PROGRESS.total} task selesai`}
          icon={<TrendingUp size={16} />}
        />
        <DashboardCard
          title="Task Tersisa"
          value={DEMO_TASKS.filter((t) => t.status !== "completed").length}
          subtitle={`Due minggu ini: ${DEMO_TASKS.filter((t) => (t.status === "pending" || t.status === "in_progress") && t.dueDate.includes("Nov")).length}`}
          icon={<Clock size={16} />}
        />
        <DashboardCard
          title="Task Selesai"
          value={DEMO_PROGRESS.completed}
          icon={<CheckCircle size={16} />}
        />
        <DashboardCard
          title="Dokumen Tersedia"
          value={KNOWLEDGE_DOCUMENTS.length}
          subtitle="Di Knowledge Center"
          icon={<BookOpen size={16} />}
        />
      </div>

      {/* Progress bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Progress Onboarding — {DEMO_PROGRESS.currentStage}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={DEMO_PROGRESS.percentage} className="h-3" />
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>{DEMO_PROGRESS.percentage}% selesai</span>
            <span>Target: Minggu ke-2</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Mendatang</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/checklist">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-2 border-b border-surface-border last:border-0"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                  <p className="text-xs text-text-muted">Due: {task.dueDate}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/assistant">
                <Bot size={16} className="text-brand-blue" />
                Tanya AI Assistant
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/checklist">
                <CheckCircle size={16} className="text-status-success" />
                Lanjutkan onboarding checklist
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/knowledge">
                <BookOpen size={16} className="text-brand-blue" />
                Jelajahi knowledge center
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-text-muted text-center pb-2">
        Demo: {DEMO_EMPLOYEE.name} · {DEMO_EMPLOYEE.department} · Start: {DEMO_EMPLOYEE.startDate} · Mentor: {DEMO_EMPLOYEE.mentorName}
      </p>
    </div>
  );
}
