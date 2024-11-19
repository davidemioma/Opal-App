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
