"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";

export const getWorkspaceById = async (id: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const workspace = await prismadb.workspace.findUnique({
    where: {
      id,
      OR: [
        {
          user: {
            id: user.id,
          },
        },
        {
          members: {
            some: {
              user: {
                id: user.id,
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
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const workspaces = await prismadb.workspace.findMany({
    where: {
      OR: [
        {
          user: {
            id: user.id,
          },
        },
        {
          members: {
            some: {
              user: {
                id: user.id,
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
      createdAt: "asc",
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
