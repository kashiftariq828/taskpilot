import Link from "next/link";
import {
  FolderKanban,
  ListTodo,
  CircleDot,
  CircleCheckBig,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    projectCount,
    taskCount,
    inProgressCount,
    doneCount,
    recentProjects,
    upcomingTasks,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "DONE" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { tasks: true } } },
    }),
    prisma.task.findMany({
      take: 5,
      where: { status: { not: "DONE" } },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: { project: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "Projects", value: projectCount, icon: FolderKanban },
    { label: "Total Tasks", value: taskCount, icon: ListTodo },
    { label: "In Progress", value: inProgressCount, icon: CircleDot },
    { label: "Completed", value: doneCount, icon: CircleCheckBig },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your projects and tasks."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                <stat.icon
                  className="size-4.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/projects" />}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No projects yet.
              </p>
            ) : (
              <ul className="divide-y">
                {recentProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project._count.tasks} task
                        {project._count.tasks === 1 ? "" : "s"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming Tasks</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/tasks" />}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No open tasks.
              </p>
            ) : (
              <ul className="divide-y">
                {upcomingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {task.project.name}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
