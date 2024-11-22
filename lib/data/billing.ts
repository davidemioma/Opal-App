"use server";

import prismadb from "../prisma-db";
import { currentUser } from "@clerk/nextjs/server";

export const getPaymentInfo = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const paymentInfo = await prismadb.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      subscription: {
        select: {
          plan: true,
        },
      },
    },
  });

  return paymentInfo;
};
