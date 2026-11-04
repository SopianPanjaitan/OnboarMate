import React from "react";
import { Upload, Search, FileText, MoreHorizontal, Info, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
type DocStatus = "uploaded" | "processing" | "indexed" | "failed" | "archived";

const documents = [
  { id: 1, title: "Employee Handbook", category: "Policy", version: 2, audience: "all_employees", status: "indexed" as DocStatus, size: "1.2 MB", uploadedBy: "Sarah W.", uploadedAt: "Oct 15, 2026", published: true },
  { id: 2, title: "IT Security Guidelines", category: "Security", version: 1, audience: "all_employees", status: "indexed" as DocStatus, size: "580 KB", uploadedBy: "Sarah W.", uploadedAt: "Sep 20, 2026", published: true },
  { id: 3, title: "Development Environment Setup", category: "Technical", version: 3, audience: "all_employees", status: "indexed" as DocStatus, size: "2.1 MB", uploadedBy: "Reza A.", uploadedAt: "Nov 1, 2026", published: true },
  { id: 4, title: "HR Compensation Policy", category: "HR Confidential", version: 1, audience: "hr_only", status: "indexed" as DocStatus, size: "340 KB", uploadedBy: "Sarah W.", uploadedAt: "Aug 10, 2026", published: false },
  { id: 5, title: "Q4 All-Hands Slides", category: "Internal", version: 1, audience: "all_employees", status: "processing" as DocStatus, size: "5.4 MB", uploadedBy: "Fajar M.", uploadedAt: "Nov 3, 2026", published: false },
  { id: 6, title: "Scanned Office Floor Plan", category: "Facilities", version: 1, audience: "all_employees", status: "failed" as DocStatus, size: "8.2 MB", uploadedBy: "Hendra K.", uploadedAt: "Oct 28, 2026", published: false },
];

const audienceLabel: Record<string, string> = {
  all_employees: "All Employees",
  hr_only: "HR Only",
  mentors_and_employees: "Mentors & Employees",
  selected_roles: "Selected Roles",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Document Management</h2>
          <p className="text-sm text-text-secondary mt-1">
            Nexora Technologies · Knowledge base documents{" "}
            <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
          </p>
        </div>
        <Button>
          <Upload size={16} className="mr-2" /> Upload document
        </Button>
      </div>

      {/* Info */}
      <Card className="bg-status-info-bg border-status-info border-opacity-30">
        <CardContent className="py-3 px-4 flex gap-2 items-start">
          <Info size={14} className="text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-status-info">
            Documents are processed server-side (text extraction → chunking → embedding). Signed URL downloads and real upload flow will be implemented in Phase 4. Failed documents (e.g. scanned PDFs requiring OCR) are not supported in MVP.
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search documents…" className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-text-muted flex-shrink-0" />
                      <span className="font-medium text-text-primary">{doc.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary text-xs">{doc.category}</TableCell>
                  <TableCell className="text-text-muted text-xs">v{doc.version}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-surface-gray-mid px-2 py-0.5 rounded-full text-text-secondary">
                      {audienceLabel[doc.audience] ?? doc.audience}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={doc.status} /></TableCell>
                  <TableCell>
                    {doc.published ? (
                      <span className="text-xs text-status-success font-medium">Published</span>
                    ) : (
                      <span className="text-xs text-text-muted">Draft</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs text-text-secondary">{doc.uploadedAt}</p>
                      <p className="text-[10px] text-text-muted">{doc.uploadedBy} · {doc.size}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Eye size={12} /></Button>
                      <Button variant="ghost" size="sm"><MoreHorizontal size={12} /></Button>
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
