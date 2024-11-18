import { z } from "zod";

export const WorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name cannot be empty" }),
});

export type WorkspaceValidator = z.infer<typeof WorkspaceSchema>;
