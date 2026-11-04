import React from "react";
import { CheckSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
type TaskStatus = "completed" | "in_progress" | "pending" | "blocked";

interface Task {
  id: number;
  title: string;
  description: string;
  stage: string;
  status: TaskStatus;
  dueDate: string;
  required: boolean;
}

const demoTasks: Task[] = [
  { id: 1, title: "Sign employment contract", description: "Review and sign your employment contract via HR portal.", stage: "Pre-boarding", status: "completed", dueDate: "Oct 28", required: true },
  { id: 2, title: "Complete IT equipment form", description: "Submit laptop and peripheral preferences.", stage: "Pre-boarding", status: "completed", dueDate: "Oct 30", required: true },
  { id: 3, title: "ID and bank detail submission", description: "Submit ID documents and bank account for payroll.", stage: "Pre-boarding", status: "completed", dueDate: "Oct 30", required: true },
  { id: 4, title: "Attend orientation session", description: "Join the company-wide orientation on your first day.", stage: "Week 1", status: "completed", dueDate: "Nov 1", required: true },
  { id: 5, title: "Review employee handbook", description: "Read the Nexora Technologies employee handbook.", stage: "Week 1", status: "in_progress", dueDate: "Nov 5", required: true },
  { id: 6, title: "Set up development environment", description: "Follow the dev setup guide in the knowledge center.", stage: "Week 1", status: "in_progress", dueDate: "Nov 6", required: true },
  { id: 7, title: "Schedule meet-and-greet with team", description: "Book 30-min introductory calls with each team member.", stage: "Week 1", status: "pending", dueDate: "Nov 7", required: false },
  { id: 8, title: "Complete security awareness training", description: "Finish the mandatory cybersecurity module.", stage: "Week 2", status: "pending", dueDate: "Nov 10", required: true },
  { id: 9, title: "Meet with assigned mentor", description: "First structured session with your onboarding mentor.", stage: "Week 2", status: "pending", dueDate: "Nov 11", required: false },
  { id: 10, title: "Submit 30-day check-in form", description: "Share early feedback on your onboarding experience.", stage: "Week 4", status: "pending", dueDate: "Nov 28", required: false },
];

const stages = ["Pre-boarding", "Week 1", "Week 2", "Week 4"];

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  completed: <CheckCircle size={16} className="text-status-success" />,
  in_progress: <Clock size={16} className="text-status-info" />,
  pending: <CheckSquare size={16} className="text-text-muted" />,
  blocked: <AlertCircle size={16} className="text-status-error" />,
};

export default function ChecklistPage() {
  const completed = demoTasks.filter((t) => t.status === "completed").length;
  const progress = Math.round((completed / demoTasks.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Onboarding Checklist</h2>
        <p className="text-sm text-text-secondary mt-1">
          Nexora Technologies · Software Engineer · Cohort Nov 2026{" "}
          <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
        </p>
      </div>

      {/* Progress summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">
              {completed} of {demoTasks.length} tasks complete
            </span>
            <span className="text-sm font-semibold text-brand-blue">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="grid grid-cols-3 gap-4 mt-4 text-center text-xs text-text-muted">
            <div>
              <p className="text-lg font-bold text-status-success">{completed}</p>
              <p>Completed</p>
            </div>
            <div>
              <p className="text-lg font-bold text-status-info">{demoTasks.filter((t) => t.status === "in_progress").length}</p>
              <p>In Progress</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-muted">{demoTasks.filter((t) => t.status === "pending").length}</p>
              <p>Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by stage */}
      {stages.map((stage) => {
        const stageTasks = demoTasks.filter((t) => t.stage === stage);
        return (
          <div key={stage} className="space-y-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              {stage}
            </h3>
            <div className="space-y-2">
              {stageTasks.map((task) => (
                <Card key={task.id} className={task.status === "completed" ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{statusIcon[task.status]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-text-muted" : "text-text-primary"}`}>
                            {task.title}
                          </p>
                          {task.required && (
                            <span className="text-[10px] bg-brand-blue-light text-brand-blue px-1.5 py-0.5 rounded-full font-medium">
                              Required
                            </span>
                          )}
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{task.description}</p>
                        <p className="text-xs text-text-muted mt-1">Due: {task.dueDate}</p>
                      </div>
                      {task.status !== "completed" && (
                        <Button variant="outline" size="sm" className="flex-shrink-0">
                          Mark done
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-text-muted text-center py-4">
        Task completion will be persisted in Phase 2 (database integration).
      </p>
    </div>
  );
}
