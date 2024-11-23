"use server";

import prismadb from "../prisma-db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

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
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    // Check if user in the database
    const dbUser = await prismadb.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!dbUser) {
      return { status: 404, error: "Unauthorized, User not found!" };
    }

    await prismadb.comment.create({
      data: {
        userId: dbUser.id,
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
