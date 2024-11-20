"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getFolderVideos = cache(
  async ({
    workspaceId,
    folderId,
  }: {
    workspaceId: string;
    folderId: string;
  }) => {
    const user = await currentUser();

    if (!user) {
      return [];
    }

    const videos = await prismadb.video.findMany({
      where: {
        workspaceId,
        folderId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return videos;
  }
);

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const folders = await prismadb.folder.findMany({
    where: {
      workSpaceId: workspaceId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return folders;
};

export const getWorkspacesOptions = async () => {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspaces;
};
