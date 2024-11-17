"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    const dbUser = await prismadb.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        workSpaces: {
          select: {
            id: true,
          },
        },
      },
    });

    if (dbUser) {
      return { status: 200, user: dbUser };
    } else {
      const newUser = await prismadb.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstname: user.firstName,
          lastname: user.lastName,
          image: user.imageUrl,
          studio: {
            create: {},
          },
          subscription: {
            create: {},
          },
          workSpaces: {
            create: {
              name: `${user.firstName}'s Workspace`,
            },
          },
        },
        select: {
          workSpaces: {
            select: {
              id: true,
            },
          },
        },
      });

      return { status: 201, user: newUser };
    }
  } catch (err) {
    console.error("OnBoard User", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

export const inviteUser = async ({
  workspaceId,
  recieverId,
  email,
}: {
  workspaceId: string;
  recieverId: string;
  email: string;
}) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    // Check if user in the database
    const dbUser = await prismadb.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!dbUser) {
      return { status: 404, error: "User not found!" };
    }

    // Check if reciever in the database
    const reciever = await prismadb.user.findUnique({
      where: {
        id: recieverId,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!reciever) {
      return { status: 404, error: "Reciepiant not found!" };
    }

    // Check if workspace exists
    const workspace = await prismadb.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workspace) {
      return { status: 404, error: "Workspace not found!" };
    }

    // Send Invite
    await prismadb.invite.create({
      data: {
        workSpaceId: workspace.id,
        senderId: dbUser.id,
        recieverId,
        content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
      },
    });

    // Create Notification for sender and reciever
    await prismadb.notification.create({
      data: {
        userId: dbUser.id,
        content: `invitation to ${workspace.name} has been sent to ${reciever.firstname} ${reciever.lastname}`,
      },
    });

    await prismadb.notification.create({
      data: {
        userId: reciever.id,
        content: `${dbUser.firstname} ${dbUser.lastname} invited you into ${workspace.name}`,
      },
    });

    // Send email notification to reciever as well.

    return {
      status: 200,
      message: `Invitation sent to ${reciever.firstname} ${reciever.lastname}`,
    };
  } catch (err) {
    console.error("Invite User", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
