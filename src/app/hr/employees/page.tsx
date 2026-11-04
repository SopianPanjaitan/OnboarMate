import React from "react";
import { UserPlus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
type MemberStatus = "active" | "invited" | "suspended";

const employees = [
  { id: 1, name: "Andi Pratama", email: "andi.pratama@nexora.demo", role: "employee" as const, department: "Engineering", jobTitle: "Software Engineer", status: "active" as MemberStatus, progress: 45, startDate: "Nov 1, 2026" },
  { id: 2, name: "Budi Santoso", email: "budi.santoso@nexora.demo", role: "employee" as const, department: "Product", jobTitle: "Product Designer", status: "active" as MemberStatus, progress: 80, startDate: "Oct 15, 2026" },
  { id: 3, name: "Citra Dewi", email: "citra.dewi@nexora.demo", role: "employee" as const, department: "Analytics", jobTitle: "Data Analyst", status: "invited" as MemberStatus, progress: 0, startDate: "Nov 15, 2026" },
  { id: 4, name: "Dian Rahayu", email: "dian.rahayu@nexora.demo", role: "employee" as const, department: "Marketing", jobTitle: "Marketing Manager", status: "active" as MemberStatus, progress: 100, startDate: "Oct 1, 2026" },
  { id: 5, name: "Eko Wijaya", email: "eko.wijaya@nexora.demo", role: "mentor" as const, department: "Engineering", jobTitle: "Senior Engineer", status: "active" as MemberStatus, progress: 100, startDate: "Jan 2025" },
  { id: 6, name: "Fitri Handayani", email: "fitri.h@nexora.demo", role: "employee" as const, department: "Operations", jobTitle: "Operations Analyst", status: "active" as MemberStatus, progress: 60, startDate: "Oct 20, 2026" },
];

const roleLabel: Record<string, string> = {
  employee: "Employee",
  mentor: "Mentor",
  hr_admin: "HR Admin",
};

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Employee Management</h2>
          <p className="text-sm text-text-secondary mt-1">
            Nexora Technologies · 48 members{" "}
            <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
          </p>
        </div>
        <Button>
          <UserPlus size={16} className="mr-2" /> Invite employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search employees…" className="pl-8" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={14} /> Filter by department
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter size={14} /> Filter by status
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{emp.name}</p>
                        <p className="text-xs text-text-muted">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{emp.department}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-surface-gray-mid px-2 py-0.5 rounded-full text-text-secondary">
                      {roleLabel[emp.role]}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-secondary text-xs">{emp.startDate}</TableCell>
                  <TableCell><StatusBadge status={emp.status} /></TableCell>
                  <TableCell>
                    {emp.status === "active" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={emp.progress} className="w-16 h-1.5" />
                        <span className="text-xs text-text-muted">{emp.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
