"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { subtaskFormSchema } from "@/lib/validations/subtask";
import { Prisma, type Subtask } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/types";

export async function createSubtask(
  taskId: string,
  values: unknown,
): Promise<ActionResult<Subtask>> {
  const parsed = subtaskFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const subtask = await prisma.subtask.create({
      data: {
        title: parsed.data.title,
        taskId,
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, data: subtask };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { ok: false, error: "Parent task no longer exists." };
    }
    throw error;
  }
}

export async function setSubtaskCompleted(
  id: string,
  completed: boolean,
): Promise<ActionResult<Subtask>> {
  try {
    const subtask = await prisma.subtask.update({
      where: { id },
      data: { completed },
    });

    revalidatePath("/", "layout");
    return { ok: true, data: subtask };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        ok: false,
        error: "Subtask not found. It may have been deleted.",
      };
    }
    throw error;
  }
}

export async function deleteSubtask(id: string): Promise<ActionResult> {
  try {
    await prisma.subtask.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true, data: undefined };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        ok: false,
        error: "Subtask not found. It may already be deleted.",
      };
    }
    throw error;
  }
}

export async function listSubtasks(
  taskId: string,
): Promise<ActionResult<Subtask[]>> {
  const subtasks = await prisma.subtask.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
  });

  return { ok: true, data: subtasks };
}
