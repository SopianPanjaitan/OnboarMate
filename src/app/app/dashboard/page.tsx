import React from "react";
import { CheckCircle, Clock, Bot, BookOpen, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ⚠️ All data below is synthetic demo content for Nexora Technologies (fictional organization)
const demoTasks = [
  { id: 1, title: "Complete IT equipment form", status: "completed" as const, dueDate: "Nov 1" },
  { id: 2, title: "Review employee handbook", status: "in_progress" as const, dueDate: "Nov 5" },
  { id: 3, title: "Schedule meet-and-greet with team", status: "pending" as const, dueDate: "Nov 7" },
  { id: 4, title: "Complete security awareness training", status: "pending" as const, dueDate: "Nov 10" },
];

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Welcome, Andi 👋</h2>
        <p className="text-text-secondary text-sm mt-1">
          You&apos;re 45% through your onboarding at Nexora Technologies.{" "}
          <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Overall Progress"
          value="45%"
          subtitle="9 of 20 tasks complete"
          icon={<TrendingUp size={16} />}
        />
        <DashboardCard
          title="Tasks Remaining"
          value="11"
          subtitle="Due this week: 3"
          icon={<Clock size={16} />}
        />
        <DashboardCard
          title="Completed Tasks"
          value="9"
          icon={<CheckCircle size={16} />}
        />
        <DashboardCard
          title="Knowledge Articles"
          value="24"
          subtitle="Available in your library"
          icon={<BookOpen size={16} />}
        />
      </div>

      {/* Progress bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Onboarding Progress — Week 1</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={45} className="h-3" />
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>45% complete</span>
            <span>Target: Week 2</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/checklist">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-2 border-b border-surface-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{task.title}</p>
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/assistant">
                <Bot size={16} className="text-brand-blue" />
                Ask the AI Assistant
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/checklist">
                <CheckCircle size={16} className="text-status-success" />
                Continue onboarding checklist
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/app/knowledge">
                <BookOpen size={16} className="text-brand-blue" />
                Browse knowledge center
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
