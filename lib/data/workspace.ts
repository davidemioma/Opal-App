"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getWorkspaceById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const workspace = await prismadb.workspace.findUnique({
    where: {
      id,
      user: {
        clerkId: user.id,
      },
    },
    select: {
      id: true,
      user: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      },
    },
  });

  return workspace;
};

export const getWorkspaces = async () => {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const workspaces = await prismadb.workspace.findMany({
    where: {
      OR: [
        {
          user: {
            clerkId: user.id,
          },
        },
        {
          members: {
            some: {
              user: {
                clerkId: user.id,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspaces;
};
