"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { projectFormSchema } from "@/lib/validations/project";
import { Prisma, type Project } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/types";

export async function createProject(
  values: unknown
): Promise<ActionResult<Project>> {
  const parsed = projectFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true, data: project };
}

export async function updateProject(
  id: string,
  values: unknown
): Promise<ActionResult<Project>> {
  const parsed = projectFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, data: project };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Project not found. It may have been deleted." };
    }
    throw error;
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true, data: undefined };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Project not found. It may already be deleted." };
    }
    throw error;
  }
}
