"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getFolderInfo = cache(
  async ({
    workSpaceId,
    folderId,
  }: {
    workSpaceId: string;
    folderId: string;
  }) => {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const folder = await prismadb.folder.findUnique({
      where: {
        id: folderId,
        workSpaceId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return folder;
  }
);

export const getFolders = async (workSpaceId: string) => {
  const folders = await prismadb.folder.findMany({
    where: {
      workSpaceId,
    },
    select: {
      id: true,
      name: true,
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
