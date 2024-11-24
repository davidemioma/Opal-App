"use server";

import prismadb from "../prisma-db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../data/auth";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { WorkspaceValidator, WorkspaceSchema } from "../validators/workspace";

export const verifyUser = async (workspaceId: string) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

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

export const createWorkspace = async (values: WorkspaceValidator) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    if (user.subscription?.plan !== SUBSCRIPTION_PLAN.PRO) {
      return {
        status: 401,
        error: "You need to be on the PRO plan to create a worksapce!",
      };
    }

    const validatedFields = WorkspaceSchema.safeParse(values);

    if (!validatedFields.success) {
      return { status: 400, error: "Invalid fields!" };
    }

    const workspace = await prismadb.workspace.create({
      data: {
        ...values,
        userId: user.id,
        type: "PUBLIC",
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/");

    return {
      status: 201,
      workspaceId: workspace.id,
      message: `Workspace ${values.name} was created!`,
    };
  } catch (err) {
    console.error("Create Workspace", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
