import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-gray">
      <Sidebar role="employee" />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNav userName="Andi Pratama" userRole="employee" />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
