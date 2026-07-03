import { Badge } from "@/components/ui/badge";
import type { Status } from "@/generated/prisma/client";

const statusConfig: Record<Status, { label: string; className: string }> = {
  TODO: {
    label: "To Do",
    className: "bg-secondary text-secondary-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  DONE: {
    label: "Done",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge variant="ghost" className={config.className}>
      {config.label}
    </Badge>
  );
}
