"use client";

import React from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopNavProps {
  userName?: string;
  userRole?: "employee" | "hr";
  pageTitle?: string;
}

export function TopNav({
  userName = "Demo User",
  userRole = "employee",
  pageTitle,
}: TopNavProps) {
  return (
    <header className="h-14 bg-surface-white border-b border-surface-border flex items-center justify-between px-6 flex-shrink-0">
      <div>
        {pageTitle && (
          <h1 className="text-base font-semibold text-text-primary">{pageTitle}</h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Notification bell (placeholder) */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={18} className="text-text-secondary" />
        </Button>

        {/* User avatar + name */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-text-primary leading-none">{userName}</p>
            <p className="text-xs text-text-muted capitalize">{userRole === "hr" ? "HR Admin" : "Employee"}</p>
          </div>
          <ChevronDown size={14} className="text-text-muted" />
        </div>

        {/* Logout placeholder */}
        <Button variant="ghost" size="icon" aria-label="Sign out">
          <LogOut size={18} className={cn("text-text-secondary")} />
        </Button>
      </div>
    </header>
  );
}
