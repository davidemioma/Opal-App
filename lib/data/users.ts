"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getSearchedUsers = async ({
  query,
  workspaceId,
}: {
  query: string;
  workspaceId: string;
}) => {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const users = await prismadb.user.findMany({
    where: {
      OR: [
        { firstname: { contains: query } },
        { email: { contains: query } },
        { lastname: { contains: query } },
      ],
      NOT: {
        clerkId: user.id,
      },
      workSpacesJoined: {
        none: {
          workSpaceId: workspaceId,
        },
      },
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      image: true,
      subscription: {
        select: {
          plan: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const getUserSettings = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userSettings = await prismadb.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      firstView: true,
    },
  });

  return userSettings;
};
