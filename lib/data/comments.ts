"use server";

import prismadb from "../prisma-db";

export const getComments = async (videoId: string) => {
  const comments = await prismadb.comment.findMany({
    where: {
      videoId,
      NOT: {
        commentId: {
          not: null,
        },
      },
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

export const getReplies = async ({
  videoId,
  commentId,
}: {
  videoId: string;
  commentId: string;
}) => {
  const replies = await prismadb.comment.findMany({
    where: {
      videoId,
      commentId,
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return replies;
};
