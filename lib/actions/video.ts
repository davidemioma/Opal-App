"use server";

import prismadb from "../prisma-db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../data/auth";
import { EditVideoValidator } from "../validators/video";

export const editVideoInfo = async ({
  videoId,
  values,
}: {
  videoId: string;
  values: EditVideoValidator;
}) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    const video = await prismadb.video.update({
      where: {
        id: videoId,
        userId: user.id,
      },
      data: {
        ...values,
      },
      select: {
        id: true,
        workspaceId: true,
        folderId: true,
      },
    });

    if (!video) {
      return { status: 404, error: "Video not found" };
    }

    revalidatePath(`/dashboard/${video.workspaceId}/folders/${video.folderId}`);

    revalidatePath(`/dashboard/${video.workspaceId}/videos/${video.id}`);

    return { status: 200, message: "Video info updated!" };
  } catch (err) {
    console.error("Update Video Info", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

export const changeVideoLocation = async ({
  videoId,
  workspaceId,
  folderId,
  pathname,
}: {
  videoId: string;
  workspaceId: string;
  folderId: string;
  pathname?: string;
}) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    // Check if user in the workspace
    const workspace = await prismadb.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            user: {
              id: user.id, // Check if the user is the creator of the workspace
            },
          },
          {
            members: {
              some: {
                user: {
                  id: user.id, // Check if the user is a member of the workspace
                },
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      return { status: 404, error: "Workspace not found" };
    }

    // Move Video
    const video = await prismadb.video.update({
      where: {
        id: videoId,
      },
      data: {
        workspaceId,
        folderId: folderId,
      },
    });

    if (pathname) {
      revalidatePath(pathname);
    }

    revalidatePath(`/dashboard/${workspaceId}/folders/${folderId}`);

    revalidatePath(`/dashboard/${workspaceId}/videos/${videoId}`);

    if (!video) {
      return { status: 404, error: "workspace/folder not found" };
    }

    return { status: 200, message: "Video location changed successfully" };
  } catch (err) {
    console.error("Moving video location", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
