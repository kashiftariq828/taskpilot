"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListTodo } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { TaskRow } from "@/components/tasks/task-row";
import { deleteTask } from "@/lib/actions/tasks";
import type { Task } from "@/generated/prisma/client";

type TaskWithProject = Task & { project: { name: string } };
type ProjectOption = { id: string; name: string };

export function TasksList({
  tasks,
  projects,
}: {
  tasks: TaskWithProject[];
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [optimisticTasks, removeOptimistic] = useOptimistic(
    tasks,
    (state, id: string) => state.filter((task) => task.id !== id)
  );
  const [, startTransition] = useTransition();

  function handleDelete(task: Task) {
    startTransition(async () => {
      removeOptimistic(task.id);
      const result = await deleteTask(task.id);
      if (result.ok) {
        toast.success("Task deleted", { description: task.title });
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (optimisticTasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No tasks yet"
        description="Tasks you add to a project will show up here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-4 py-2.5 font-medium">Project</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Due</th>
            <th className="px-2 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {optimisticTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              projects={projects}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
