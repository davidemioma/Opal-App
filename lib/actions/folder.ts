"use server";

import prismadb from "../prisma-db";
import { revalidatePath } from "next/cache";

export const createFolder = async (workSpaceId: string) => {
  try {
    await prismadb.folder.create({
      data: {
        workSpaceId,
        name: "Untitled",
      },
    });

    revalidatePath("/");

    return { status: 201, message: `New folder created!` };
  } catch (err) {
    console.error("Create Folder", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

export const updateFolder = async ({
  folderId,
  name,
}: {
  folderId: string;
  name: string;
}) => {
  try {
    const folder = await prismadb.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
      select: {
        name: true,
      },
    });

    revalidatePath("/");

    return {
      status: 201,
      name: folder.name,
      message: `Folder has been updated!`,
    };
  } catch (err) {
    console.error("Update Folder", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
