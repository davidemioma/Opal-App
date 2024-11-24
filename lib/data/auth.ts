"use server";

import { cache } from "react";
import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getCurrentUser = cache(async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const dbUser = prismadb.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      image: true,
      subscription: {
        select: {
          plan: true,
        },
      },
    },
  });

  return dbUser;
});
