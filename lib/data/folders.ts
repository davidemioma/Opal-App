"use server";

import prismadb from "../prisma-db";

export const getFolders = async (workSpaceId: string) => {
  const folders = await prismadb.folder.findMany({
    where: {
      workSpaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
