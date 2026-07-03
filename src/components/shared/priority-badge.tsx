import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/generated/prisma/client";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "bg-secondary text-secondary-foreground",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  HIGH: {
    label: "High",
    className:
      "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="ghost" className={config.className}>
      {config.label}
    </Badge>
  );
}
