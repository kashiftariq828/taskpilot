"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { taskFormSchema } from "@/lib/validations/task";
import { Prisma, type Task } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/types";

export async function createTask(values: unknown): Promise<ActionResult<Task>> {
  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate ?? null,
        projectId: parsed.data.projectId,
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, data: task };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { ok: false, error: "Selected project no longer exists." };
    }
    throw error;
  }
}

export async function updateTask(
  id: string,
  values: unknown
): Promise<ActionResult<Task>> {
  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate ?? null,
        projectId: parsed.data.projectId,
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, data: task };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2025" || error.code === "P2003")
    ) {
      return {
        ok: false,
        error:
          error.code === "P2003"
            ? "Selected project no longer exists."
            : "Task not found. It may have been deleted.",
      };
    }
    throw error;
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true, data: undefined };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Task not found. It may already be deleted." };
    }
    throw error;
  }
}
