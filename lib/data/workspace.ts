"use server";

import { cache } from "react";
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

export const getWorkspaceVideos = cache(async (workspaceId: string) => {
  const videos = await prismadb.video.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      source: true,
      title: true,
      processing: true,
      createdAt: true,
      workspace: {
        select: {
          name: true,
        },
      },
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          firstname: true,
          lastname: true,
          image: true,
        },
      },
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return videos;
});
