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

export const getWorkspaceFolders = async (id: string) => {
  const folders = await prismadb.folder.findMany({
    where: {
      workSpaceId: id,
    },
    include: {
      _count: {
        select: {
          videos: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return folders;
};

export const getVideosByWorkspaceOrFolderId = async (id: string) => {
  const user = await currentUser();

  if (!user || !id) {
    return [];
  }

  const videos = await prismadb.video.findMany({
    where: {
      OR: [{ workspaceId: id }, { folderId: id }],
    },
    select: {
      id: true,
      source: true,
      title: true,
      processing: true,
      createdAt: true,
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
      createdAt: "asc",
    },
  });

  return videos;
};

export const getUserNotifications = async () => {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const notifications = await prismadb.notification.findMany({
    where: {
      user: {
        clerkId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};
