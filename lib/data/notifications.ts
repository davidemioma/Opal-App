"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getUserNotifications = cache(async () => {
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
    select: {
      id: true,
      content: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
});
