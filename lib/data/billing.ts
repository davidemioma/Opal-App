"use server";

import prismadb from "../prisma-db";
import { getCurrentUser } from "./auth";

export const getPaymentInfo = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const paymentInfo = await prismadb.user.findUnique({
    where: {
      id: user.id,
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
