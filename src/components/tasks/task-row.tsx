"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { SubtaskProgressBadge } from "@/components/tasks/subtask-progress-badge";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import type { Task } from "@/generated/prisma/client";

type TaskWithProject = Task & {
  project: { name: string };
  subtaskTotal: number;
  subtaskCompleted: number;
};
type ProjectOption = { id: string; name: string };

export function TaskRow({
  task,
  projects,
  onDelete,
}: {
  task: TaskWithProject;
  projects: ProjectOption[];
  onDelete: (task: Task) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <tr>
        <td className="max-w-64 truncate px-4 py-3 font-medium">
          {task.title}
        </td>
        <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
          {task.project.name}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={task.status} />
        </td>
        <td className="px-4 py-3">
          <PriorityBadge priority={task.priority} />
        </td>
        <td className="px-4 py-3">
          <SubtaskProgressBadge
            completed={task.subtaskCompleted}
            total={task.subtaskTotal}
          />
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "—"}
        </td>
        <td className="px-2 py-3 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <MoreHorizontal />
              <span className="sr-only">Task actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <TaskFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        task={task}
        projects={projects}
      />
      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        task={task}
        onConfirm={() => onDelete(task)}
      />
    </>
  );
}
