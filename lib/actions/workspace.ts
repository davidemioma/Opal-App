"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const verifyUser = async (workspaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    const workspace = await prismadb.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            user: {
              clerkId: user.id, // Check if the user is the creator of the workspace
            },
          },
          {
            members: {
              some: {
                user: {
                  clerkId: user.id, // Check if the user is a member of the workspace
                },
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      return { status: 404, error: "Work space not found" };
    }

    return { status: 200, workspace };
  } catch (err) {
    console.error("Verify Workspace User", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
