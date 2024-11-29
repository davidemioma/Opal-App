"use server";

import { wixClient } from "../wix";
import prismadb from "../prisma-db";

export const getWixContent = async () => {
  const wixVideos = await wixClient.items
    .queryDataItems({
      dataCollectionId: "opal-videos",
    })
    .find();

  const videoIds = wixVideos.items.map((video) => video.data?.title);

  const videos = await prismadb.video.findMany({
    where: {
      id: {
        in: videoIds,
      },
    },
    select: {
      id: true,
      source: true,
      title: true,
      processing: true,
      createdAt: true,
      workspace: {
        select: {
          id: true,
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
};
