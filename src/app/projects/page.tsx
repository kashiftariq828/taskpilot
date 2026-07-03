import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectsList } from "@/components/projects/projects-list";
import { NewProjectButton } from "@/components/projects/new-project-button";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { tasks: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Organize your work into projects."
        actions={<NewProjectButton />}
      />
      <ProjectsList projects={projects} />
    </div>
  );
}
