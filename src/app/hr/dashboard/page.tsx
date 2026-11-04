import React from "react";
import { Users, CheckSquare, FileText, TrendingUp, UserPlus, Clock } from "lucide-react";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
const recentEmployees = [
  { id: 1, name: "Andi Pratama", role: "Software Engineer", department: "Engineering", status: "active" as const, progress: 45, startDate: "Nov 1, 2026" },
  { id: 2, name: "Budi Santoso", role: "Product Designer", department: "Product", status: "active" as const, progress: 80, startDate: "Oct 15, 2026" },
  { id: 3, name: "Citra Dewi", role: "Data Analyst", department: "Analytics", status: "invited" as const, progress: 0, startDate: "Nov 15, 2026" },
  { id: 4, name: "Dian Rahayu", role: "Marketing Manager", department: "Marketing", status: "active" as const, progress: 100, startDate: "Oct 1, 2026" },
];

export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">HR Dashboard</h2>
          <p className="text-sm text-text-secondary mt-1">
            Nexora Technologies · November 2026{" "}
            <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/invitations">
            <UserPlus size={16} className="mr-2" /> Invite employee
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Employees"
          value="48"
          subtitle="4 onboarding this month"
          icon={<Users size={16} />}
        />
        <DashboardCard
          title="Active Onboardings"
          value="7"
          subtitle="3 on track, 1 overdue"
          icon={<Clock size={16} />}
        />
        <DashboardCard
          title="Documents Indexed"
          value="12"
          subtitle="3 pending review"
          icon={<FileText size={16} />}
        />
        <DashboardCard
          title="Avg. Completion"
          value="73%"
          subtitle="Up from 65% last month"
          trend={{ value: 8, label: "from last month" }}
          icon={<TrendingUp size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent onboardings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Onboardings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hr/employees">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-primary">{emp.name}</p>
                        <p className="text-xs text-text-muted">{emp.role}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{emp.department}</TableCell>
                    <TableCell><StatusBadge status={emp.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-surface-gray-mid rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{ width: `${emp.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">{emp.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/hr/invitations", icon: <UserPlus size={14} />, label: "Send invitation" },
              { href: "/hr/onboarding", icon: <CheckSquare size={14} />, label: "Manage templates" },
              { href: "/hr/documents", icon: <FileText size={14} />, label: "Upload document" },
              { href: "/hr/reports", icon: <TrendingUp size={14} />, label: "View reports" },
            ].map((a) => (
              <Button key={a.href} variant="outline" className="w-full justify-start gap-2" size="sm" asChild>
                <Link href={a.href}>{a.icon}{a.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
