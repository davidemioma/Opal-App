import { z } from "zod";

export const MoveVideoSchema = z.object({
  workspaceId: z.string().min(25, { message: "Invalid workspace ID" }),
  folderId: z.string().min(25, { message: "Invalid folder ID" }),
});

export type MoveVideoValidator = z.infer<typeof MoveVideoSchema>;
