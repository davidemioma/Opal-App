"use server";

import prismadb from "../prisma-db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../data/auth";

export const sendComment = async ({
  commentId,
  videoId,
  text,
  paths,
}: {
  commentId?: string | null | undefined;
  videoId: string;
  text: string;
  paths?: string[];
}) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    await prismadb.comment.create({
      data: {
        userId: user.id,
        videoId,
        commentId: commentId || undefined,
        text,
      },
    });

    if (paths && paths?.length > 0) {
      paths.forEach((pathname) => {
        revalidatePath(pathname);
      });
    }

    return {
      status: 201,
      message: commentId ? "Reply sent!" : "Comment sent!",
    };
  } catch (err) {
    console.error("Send Comment", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
