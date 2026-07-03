"use client";

import {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createSubtask,
  deleteSubtask,
  listSubtasks,
  setSubtaskCompleted,
} from "@/lib/actions/subtasks";
import { subtaskFormSchema } from "@/lib/validations/subtask";
import { cn } from "@/lib/utils";
import type { Subtask } from "@/generated/prisma/client";

type OptimisticAction =
  | { type: "add"; subtask: Subtask }
  | { type: "toggle"; id: string; completed: boolean }
  | { type: "delete"; id: string };

function reduceSubtasks(state: Subtask[], action: OptimisticAction): Subtask[] {
  switch (action.type) {
    case "add":
      return [...state, action.subtask];
    case "toggle":
      return state.map((subtask) =>
        subtask.id === action.id
          ? { ...subtask, completed: action.completed }
          : subtask,
      );
    case "delete":
      return state.filter((subtask) => subtask.id !== action.id);
  }
}

export function SubtaskList({ taskId }: { taskId: string }) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticSubtasks, applyOptimistic] = useOptimistic(
    subtasks,
    reduceSubtasks,
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    listSubtasks(taskId).then((result) => {
      if (!active) return;
      if (result.ok) {
        setSubtasks(result.data);
      } else {
        toast.error(result.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [taskId]);

  function handleAdd() {
    const parsed = subtaskFormSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setError(null);
    const value = parsed.data.title;
    setTitle("");

    startTransition(async () => {
      const tempSubtask: Subtask = {
        id: `temp-${value}`,
        title: value,
        completed: false,
        taskId,
        createdAt: new Date(),
      };
      applyOptimistic({ type: "add", subtask: tempSubtask });

      const result = await createSubtask(taskId, { title: value });
      if (result.ok) {
        setSubtasks((prev) => [...prev, result.data]);
      } else {
        toast.error(result.error);
        setTitle(value);
      }
    });
  }

  function handleToggle(subtask: Subtask, completed: boolean) {
    startTransition(async () => {
      applyOptimistic({ type: "toggle", id: subtask.id, completed });
      const result = await setSubtaskCompleted(subtask.id, completed);
      if (result.ok) {
        setSubtasks((prev) =>
          prev.map((item) =>
            item.id === subtask.id ? { ...item, completed } : item,
          ),
        );
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(subtask: Subtask) {
    startTransition(async () => {
      applyOptimistic({ type: "delete", id: subtask.id });
      const result = await deleteSubtask(subtask.id);
      if (result.ok) {
        setSubtasks((prev) => prev.filter((item) => item.id !== subtask.id));
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  }

  const completedCount = optimisticSubtasks.filter(
    (subtask) => subtask.completed,
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Subtasks</span>
        {!loading && optimisticSubtasks.length > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedCount}/{optimisticSubtasks.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-4/5" />
        </div>
      ) : optimisticSubtasks.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
          No subtasks yet. Break this task into checklist steps below.
        </p>
      ) : (
        <ul className="space-y-1">
          {optimisticSubtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="group flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-muted/50"
            >
              <Checkbox
                checked={subtask.completed}
                onCheckedChange={(checked) => handleToggle(subtask, checked)}
                aria-label={`Mark "${subtask.title}" ${
                  subtask.completed ? "incomplete" : "complete"
                }`}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  subtask.completed && "text-muted-foreground line-through",
                )}
              >
                {subtask.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => handleDelete(subtask)}
                aria-label={`Delete "${subtask.title}"`}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add a subtask…"
            aria-invalid={Boolean(error)}
            aria-label="New subtask title"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAdd}
            disabled={title.trim().length === 0}
            aria-label="Add subtask"
          >
            <Plus />
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
