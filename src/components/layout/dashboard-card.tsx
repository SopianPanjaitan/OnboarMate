import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-brand-blue-light text-brand-blue flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {subtitle && (
          <p className="text-xs text-text-muted mt-1">{subtitle}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              trend.value >= 0 ? "text-status-success" : "text-status-error"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
