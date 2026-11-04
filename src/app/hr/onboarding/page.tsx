import React from "react";
import { Plus, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
const templates = [
  { id: 1, name: "Software Engineer Onboarding", tasks: 20, assignees: 3, active: true },
  { id: 2, name: "Product Designer Onboarding", tasks: 16, assignees: 1, active: true },
  { id: 3, name: "General Staff Onboarding", tasks: 12, assignees: 5, active: true },
  { id: 4, name: "Intern Onboarding", tasks: 8, assignees: 0, active: false },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Onboarding Templates</h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage reusable onboarding templates and task lists{" "}
            <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
          </p>
        </div>
        <Button className="gap-2"><Plus size={14} /> New template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-lg bg-brand-blue-light flex items-center justify-center">
                  <CheckSquare size={16} className="text-brand-blue" />
                </div>
                <Badge variant={t.active ? "success" : "outline"}>
                  {t.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{t.name}</CardTitle>
              <CardDescription>{t.tasks} tasks · {t.assignees} active assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Edit template</Button>
                <Button variant="outline" size="sm">Assign</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-text-muted text-center">
        Template task snapshots are created at assignment time (Phase 3).
      </p>
    </div>
  );
}
