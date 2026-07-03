import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { TasksList } from "@/components/tasks/tasks-list";
import { NewTaskButton } from "@/components/tasks/new-task-button";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [rawTasks, projects] = await Promise.all([
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { name: true } },
        // Total subtask count via Prisma `_count`...
        _count: { select: { subtasks: true } },
        // ...and completed count via a filtered relation count.
        subtasks: { where: { completed: true }, select: { id: true } },
      },
    }),
    prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const tasks = rawTasks.map(({ _count, subtasks, ...task }) => ({
    ...task,
    subtaskTotal: _count.subtasks,
    subtaskCompleted: subtasks.length,
  }));

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Everything on your plate."
        actions={<NewTaskButton projects={projects} />}
      />
      <TasksList tasks={tasks} projects={projects} />
    </div>
  );
}
