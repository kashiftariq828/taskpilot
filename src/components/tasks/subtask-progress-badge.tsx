import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Compact "completed/total" progress badge (e.g. "2/5") for a task's subtasks.
 * Renders nothing when the task has no subtasks, so the list stays quiet for
 * tasks without a checklist. Reusable anywhere a task is summarized (Tasks
 * list today; dashboard upcoming-tasks list next).
 */
export function SubtaskProgressBadge({
  completed,
  total,
  className,
}: {
  completed: number;
  total: number;
  className?: string;
}) {
  if (total <= 0) {
    return null;
  }

  const allDone = completed >= total;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "tabular-nums",
        allDone &&
          "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        className,
      )}
      aria-label={`${completed} of ${total} subtasks completed`}
    >
      {completed}/{total}
    </Badge>
  );
}
