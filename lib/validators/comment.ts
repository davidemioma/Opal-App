import { z } from "zod";

export const CommentSchema = z.object({
  text: z.string().min(1, { message: "Comment cannot be empty" }),
});

export type CommentValidator = z.infer<typeof CommentSchema>;
