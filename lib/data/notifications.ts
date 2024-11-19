"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getUserNotifications = async () => {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const notifications = await prismadb.notification.findMany({
    where: {
      user: {
        clerkId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};
