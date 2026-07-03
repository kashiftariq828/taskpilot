import { z } from "zod";

export const subtaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
});

export type SubtaskFormValues = z.infer<typeof subtaskFormSchema>;
