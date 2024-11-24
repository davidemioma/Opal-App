"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";

export const getUserNotifications = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const notifications = await prismadb.notification.findMany({
    where: {
      user: {
        id: user.id,
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
