"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";

export const getFolderVideos = cache(
  async ({
    workspaceId,
    folderId,
  }: {
    workspaceId: string;
    folderId: string;
  }) => {
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
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }

  const workspaces = await prismadb.workspace.findMany({
    where: {
      OR: [
        {
          user: {
            id: currentUser.id,
          },
        },
        {
          members: {
            some: {
              user: {
                id: currentUser.id,
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

export const getPreviewVideo = async (videoId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const video = await prismadb.video.update({
    where: {
      id: videoId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    select: {
      id: true,
      workspaceId: true,
      source: true,
      title: true,
      processing: true,
      createdAt: true,
      description: true,
      summery: true,
      views: true,
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          image: true,
          trial: true,
          clerkId: true,
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      },
    },
  });

  return { ...video, author: currentUser.id === video?.user.id };
};
