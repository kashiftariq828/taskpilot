"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderKanban } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { deleteProject } from "@/lib/actions/projects";
import type { Project } from "@/generated/prisma/client";

type ProjectWithCount = Project & { _count: { tasks: number } };

export function ProjectsList({ projects }: { projects: ProjectWithCount[] }) {
  const router = useRouter();
  const [optimisticProjects, removeOptimistic] = useOptimistic(
    projects,
    (state, id: string) => state.filter((project) => project.id !== id)
  );
  const [, startTransition] = useTransition();

  function handleDelete(project: Project) {
    startTransition(async () => {
      removeOptimistic(project.id);
      const result = await deleteProject(project.id);
      if (result.ok) {
        toast.success("Project deleted", { description: project.name });
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (optimisticProjects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Projects you create will show up here, grouping related tasks together."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {optimisticProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          taskCount={project._count.tasks}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
