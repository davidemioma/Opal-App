import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const clerkClientInstance = await clerkClient();

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  console.log("Calling Endpoint!");

  try {
    const user = await prismadb.user.findUnique({
      where: {
        clerkId: id,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        studio: {
          select: {
            id: true,
            userId: true,
            screen: true,
            preset: true,
            mic: true,
            camera: true,
          },
        },
      },
    });

    if (user) {
      return NextResponse.json({ status: 200, data: user });
    }

    const clerkUser = await clerkClientInstance.users.getUser(id);

    const newUser = await prismadb.user.create({
      data: {
        clerkId: id,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstname: clerkUser.firstName,
        lastname: clerkUser.lastName,
        studio: {
          create: {},
        },
        workSpaces: {
          create: {
            name: `${clerkUser.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: {
          create: {},
        },
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstname: true,
        lastname: true,
        createdAt: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        studio: {
          select: {
            id: true,
            userId: true,
            screen: true,
            preset: true,
            mic: true,
            camera: true,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, data: newUser });
  } catch (err) {
    console.error("GET_EXTERNAL_USER", err);

    return new NextResponse(`Internal Error! ${err}`, { status: 500 });
  }
}
