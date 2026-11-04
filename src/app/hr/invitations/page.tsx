"use client";

import React from "react";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
const invitations = [
  { id: 1, email: "citra.dewi@nexora.demo", role: "employee", department: "Analytics", invitedBy: "Sarah W.", status: "pending" as const, expiresAt: "Nov 17, 2026" },
  { id: 2, email: "hendra.k@nexora.demo", role: "employee", department: "Facilities", invitedBy: "Sarah W.", status: "pending" as const, expiresAt: "Nov 18, 2026" },
  { id: 3, email: "maya.s@nexora.demo", role: "mentor", department: "Engineering", invitedBy: "Sarah W.", status: "pending" as const, expiresAt: "Nov 10, 2026" },
];

export default function InvitationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Invitations</h2>
        <p className="text-sm text-text-secondary mt-1">
          HR-managed employee invitations — no public sign-up{" "}
          <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
        </p>
      </div>

      {/* Invite form */}
      <Card>
        <CardHeader><CardTitle>Send Invitation</CardTitle></CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 sm:grid-cols-3 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email address</Label>
              <Input id="inv-email" type="email" placeholder="new.hire@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-role">Role</Label>
              <select id="inv-role" className="flex h-10 w-full rounded-md border border-surface-border bg-surface-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue">
                <option value="employee">Employee</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-dept">Department</Label>
              <Input id="inv-dept" placeholder="e.g. Engineering" />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" className="gap-2">
                <Mail size={14} /> Send invitation
              </Button>
              <p className="text-xs text-text-muted mt-2">
                Raw tokens are not stored. Invitation is sent via Supabase Auth (Phase 2).
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pending invitations */}
      <Card>
        <CardHeader><CardTitle>Pending Invitations ({invitations.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell className="capitalize text-xs text-text-secondary">{inv.role}</TableCell>
                  <TableCell className="text-xs text-text-secondary">{inv.department}</TableCell>
                  <TableCell className="text-xs text-text-muted">{inv.invitedBy}</TableCell>
                  <TableCell className="text-xs text-text-muted">{inv.expiresAt}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><CheckCircle size={10} /> Resend</Button>
                      <Button variant="ghost" size="sm" className="text-xs gap-1 text-status-error"><XCircle size={10} /> Revoke</Button>
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
