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
