import "dotenv/config";
import { Status, Priority } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const website = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Refresh the marketing site with the new brand system.",
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: "Mobile App Launch",
      description: "Ship v1.0 of the iOS and Android apps.",
    },
  });

  const internal = await prisma.project.create({
    data: {
      name: "Internal Tooling",
      description: "Improve the team's day-to-day developer experience.",
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Audit current site information architecture",
        description: "Map every page and flag content that needs to move.",
        status: Status.DONE,
        priority: Priority.MEDIUM,
        dueDate: daysFromNow(-5),
        projectId: website.id,
      },
      {
        title: "Design new homepage hero section",
        description: "Explore three directions with the new type system.",
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: daysFromNow(2),
        projectId: website.id,
      },
      {
        title: "Migrate blog to new CMS",
        status: Status.TODO,
        priority: Priority.MEDIUM,
        dueDate: daysFromNow(10),
        projectId: website.id,
      },
      {
        title: "Set up CI/CD for App Store releases",
        description: "Automate build, sign, and submit steps.",
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: daysFromNow(4),
        projectId: mobileApp.id,
      },
      {
        title: "Write onboarding flow copy",
        status: Status.TODO,
        priority: Priority.LOW,
        dueDate: daysFromNow(14),
        projectId: mobileApp.id,
      },
      {
        title: "Fix push notification permissions bug",
        description: "Users on Android 14 are not prompted correctly.",
        status: Status.TODO,
        priority: Priority.HIGH,
        dueDate: daysFromNow(1),
        projectId: mobileApp.id,
      },
      {
        title: "Submit to App Store review",
        status: Status.TODO,
        priority: Priority.HIGH,
        dueDate: daysFromNow(18),
        projectId: mobileApp.id,
      },
      {
        title: "Upgrade CI runners to latest Node LTS",
        status: Status.DONE,
        priority: Priority.LOW,
        dueDate: daysFromNow(-12),
        projectId: internal.id,
      },
      {
        title: "Document local dev setup",
        description: "New hires should be productive in under an hour.",
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        dueDate: daysFromNow(7),
        projectId: internal.id,
      },
      {
        title: "Evaluate error tracking providers",
        status: Status.TODO,
        priority: Priority.LOW,
        projectId: internal.id,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
