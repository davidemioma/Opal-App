import { z } from "zod";

export const MoveVideoSchema = z.object({
  workspaceId: z.string().min(25, { message: "Invalid workspace ID" }),
  folderId: z.string().min(25, { message: "Invalid folder ID" }),
});

export type MoveVideoValidator = z.infer<typeof MoveVideoSchema>;

export const EditVideoSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Video title must have atleast 5 characters" }),
  description: z.string().min(10, {
    message: "Video description must have atleast 100 characters",
  }),
});

export type EditVideoValidator = z.infer<typeof EditVideoSchema>;
