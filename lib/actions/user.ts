"use server";

import prismadb from "../prisma-db";
import { sendEmail } from "../mail";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export const acceptInvitation = async (inviteId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    // Check if invitation exists
    const invitation = await prismadb.invite.findUnique({
      where: {
        id: inviteId,
        reciever: {
          clerkId: user.id,
        },
      },
      select: {
        id: true,
        workSpaceId: true,
        accepted: true,
      },
    });

    if (!invitation) {
      return { status: 404, error: "Cannot find invitation!" };
    }

    if (invitation.accepted) {
      return {
        status: 200,
        workspaceId: invitation.workSpaceId,
      };
    }

    // Add user to workspace
    await prismadb.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        workSpacesJoined: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    // Update invitation
    await prismadb.invite.update({
      where: {
        id: invitation.id,
      },
      data: {
        accepted: true,
      },
    });

    return {
      status: 200,
      workspaceId: invitation.workSpaceId,
    };
  } catch (err) {
    console.error("Accept Invite", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

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
    }

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
}: {
  workspaceId: string;
  recieverId: string;
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
        email: true,
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
        userId: dbUser.id,
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
    const invitation = await prismadb.invite.create({
      data: {
        workSpaceId: workspace.id,
        senderId: dbUser.id,
        recieverId: reciever.id,
        content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
      },
      select: {
        id: true,
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

    revalidatePath(`dashboard/${workspace}`);

    revalidatePath(`dashboard/${workspace}/notifications`);

    // Send email notification to reciever as well.
    const data = await sendEmail({
      to: reciever.email,
      subject: "You got an invitation",
      text: "You are invited to join ${workspace.name} Workspace, click accept to confirm",
      html: `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`,
    });

    const emailErr =
      "We were unable to send you an email due to our server. Check notifications for your invite. Thank you for your understanding.";

    return {
      status: 200,
      message: data.error
        ? emailErr
        : `Invitation sent to ${reciever.firstname} ${reciever.lastname}.`,
    };
  } catch (err) {
    console.error("Invite User", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

export const updateUserFirstView = async ({
  firstView,
  pathname,
}: {
  firstView: boolean;
  pathname?: string;
}) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    // Change value
    await prismadb.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstView: !firstView,
      },
    });

    if (pathname) {
      revalidatePath(pathname);
    }

    return {
      status: 200,
      message: "Settings Updated",
    };
  } catch (err) {
    console.error("Change User First View", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
