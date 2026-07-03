"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

type ProjectOption = { id: string; name: string };

export function NewTaskButton({ projects }: { projects: ProjectOption[] }) {
  const [open, setOpen] = useState(false);
  const hasProjects = projects.length > 0;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={!hasProjects}
        title={hasProjects ? undefined : "Create a project first"}
      >
        <Plus />
        New Task
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} projects={projects} />
    </>
  );
}
