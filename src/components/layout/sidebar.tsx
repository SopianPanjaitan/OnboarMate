"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Bot,
  BookOpen,
  Users,
  FileText,
  BarChart2,
  Mail,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const employeeNav: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/app/checklist", label: "Onboarding Checklist", icon: <CheckSquare size={18} /> },
  { href: "/app/assistant", label: "AI Assistant", icon: <Bot size={18} /> },
  { href: "/app/knowledge", label: "Knowledge Center", icon: <BookOpen size={18} /> },
];

const hrNav: NavItem[] = [
  { href: "/hr/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/hr/employees", label: "Employees", icon: <Users size={18} /> },
  { href: "/hr/invitations", label: "Invitations", icon: <Mail size={18} /> },
  { href: "/hr/onboarding", label: "Onboarding", icon: <CheckSquare size={18} /> },
  { href: "/hr/documents", label: "Documents", icon: <FileText size={18} /> },
  { href: "/hr/reports", label: "Reports", icon: <BarChart2 size={18} /> },
];

interface SidebarProps {
  role: "employee" | "hr";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = role === "hr" ? hrNav : employeeNav;

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-brand-navy text-text-inverse min-h-screen transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-brand-navy-light">
        <div className="h-8 w-8 rounded-md bg-brand-blue flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm tracking-wide">OnboardMate</span>
        )}
      </div>

      {/* Demo org label */}
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-brand-blue-muted border-b border-brand-navy-light">
          <span className="font-medium">Nexora Technologies</span>
          <span className="block text-[10px] opacity-60">[Demo data — fictional]</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-blue text-white"
                  : "text-brand-blue-muted hover:bg-brand-navy-light hover:text-white"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-brand-navy border border-brand-navy-light text-brand-blue-muted hover:text-white flex items-center justify-center shadow"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
