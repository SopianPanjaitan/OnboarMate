import React from "react";
import { BarChart2, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/layout/dashboard-card";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Reports</h2>
        <p className="text-sm text-text-secondary mt-1">
          Organization-level onboarding summaries{" "}
          <span className="text-[10px] text-text-muted">[Demo data — fictional · Full reports in Phase 7]</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Avg. Completion Rate" value="73%" icon={<TrendingUp size={16} />} trend={{ value: 8, label: "vs last month" }} />
        <DashboardCard title="Active Onboardings" value="7" icon={<Users size={16} />} />
        <DashboardCard title="Completed This Month" value="4" icon={<BarChart2 size={16} />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Completion by Department</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { dept: "Engineering", pct: 55 },
              { dept: "Product", pct: 80 },
              { dept: "Analytics", pct: 10 },
              { dept: "Marketing", pct: 100 },
              { dept: "Operations", pct: 60 },
            ].map((row) => (
              <div key={row.dept} className="flex items-center gap-3">
                <span className="w-28 text-sm text-text-secondary shrink-0">{row.dept}</span>
                <div className="flex-1 h-2 bg-surface-gray-mid rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-xs text-text-muted w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
