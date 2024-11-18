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
