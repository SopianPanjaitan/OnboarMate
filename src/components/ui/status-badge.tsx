import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "pending"
  | "in_progress"
  | "completed"
  | "blocked"
  | "active"
  | "invited"
  | "suspended"
  | "uploaded"
  | "processing"
  | "indexed"
  | "failed"
  | "archived";

const variantMap: Record<StatusVariant, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
  pending: "outline",
  in_progress: "info",
  completed: "success",
  blocked: "error",
  active: "success",
  invited: "info",
  suspended: "warning",
  uploaded: "info",
  processing: "warning",
  indexed: "success",
  failed: "error",
  archived: "outline",
};

const labelMap: Record<StatusVariant, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
  uploaded: "Uploaded",
  processing: "Processing",
  indexed: "Indexed",
  failed: "Failed",
  archived: "Archived",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]} className={cn(className)}>
      {labelMap[status]}
    </Badge>
  );
}
