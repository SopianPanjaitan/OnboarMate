import React from "react";
import { Search, BookOpen, FileText, Download, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

// ⚠️ Synthetic demo data for Nexora Technologies (fictional organization)
const demoDocuments = [
  {
    id: 1,
    title: "Employee Handbook",
    description: "Company policies, code of conduct, benefits, and procedures.",
    category: "Policy",
    version: 2,
    audience: "all_employees",
    updatedAt: "Oct 2026",
    status: "indexed" as const,
  },
  {
    id: 2,
    title: "IT Security Guidelines",
    description: "Acceptable use policy, password standards, and device management.",
    category: "Security",
    version: 1,
    audience: "all_employees",
    updatedAt: "Sep 2026",
    status: "indexed" as const,
  },
  {
    id: 3,
    title: "Development Environment Setup Guide",
    description: "Step-by-step instructions for setting up your local dev environment.",
    category: "Technical",
    version: 3,
    audience: "all_employees",
    updatedAt: "Nov 2026",
    status: "indexed" as const,
  },
  {
    id: 4,
    title: "Leave and Attendance Policy",
    description: "Annual leave, sick leave, public holidays, and absence procedures.",
    category: "Policy",
    version: 1,
    audience: "all_employees",
    updatedAt: "Aug 2026",
    status: "indexed" as const,
  },
  {
    id: 5,
    title: "Onboarding Welcome Pack",
    description: "Introduction to Nexora Technologies, your team, and key contacts.",
    category: "Onboarding",
    version: 1,
    audience: "all_employees",
    updatedAt: "Nov 2026",
    status: "indexed" as const,
  },
];

const categoryColors: Record<string, string> = {
  Policy: "bg-brand-blue-light text-brand-blue",
  Security: "bg-status-warning-bg text-status-warning",
  Technical: "bg-status-info-bg text-status-info",
  Onboarding: "bg-status-success-bg text-status-success",
};

export default function KnowledgeCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Knowledge Center</h2>
        <p className="text-sm text-text-secondary mt-1">
          Published documents available to you at Nexora Technologies{" "}
          <span className="text-[10px] text-text-muted">[Demo data — fictional]</span>
        </p>
      </div>

      {/* Info note */}
      <Card className="bg-status-info-bg border-status-info border-opacity-30">
        <CardContent className="py-3 px-4 flex gap-2 items-start">
          <Info size={14} className="text-status-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-status-info">
            Documents are indexed and searchable by the AI Assistant. Search and AI retrieval will be functional in Phase 5–6. Downloads require signed URLs (Phase 4).
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input placeholder="Search documents… (UI placeholder)" className="pl-9" />
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-lg bg-surface-gray-mid flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-text-secondary" />
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[doc.category] ?? "bg-surface-gray text-text-muted"}`}
                >
                  {doc.category}
                </span>
              </div>
              <CardTitle className="text-sm mt-2">{doc.title}</CardTitle>
              <CardDescription className="text-xs">{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                <span>v{doc.version} · Updated {doc.updatedAt}</span>
                <StatusBadge status={doc.status} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                  <BookOpen size={12} /> Read
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Download size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
