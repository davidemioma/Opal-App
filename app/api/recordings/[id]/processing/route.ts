import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { fileName } = body;

    if (!fileName) {
      return new NextResponse("File name not found", {
        status: 404,
      });
    }

    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
      select: {
        workSpaces: {
          where: {
            type: "PERSONAL",
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    // Create a folder for video
    const folder = await prismadb.folder.create({
      data: {
        name: "My Folder",
        workSpaceId: user.workSpaces[0].id,
      },
      select: {
        id: true,
      },
    });

    // Start processing video
    const processingVideo = await prismadb.workspace.update({
      where: {
        id: user.workSpaces[0].id,
      },
      data: {
        videos: {
          create: {
            folderId: folder.id,
            source: fileName,
            userId: id,
            processing: true,
          },
        },
      },
      select: {
        user: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      result: {
        subscription: { plan: processingVideo.user.subscription?.plan },
      },
    });
  } catch (err) {
    console.error("PROCESSING_SOCKET_ENDPOINT", err);

    return new NextResponse(`Internal Error! ${err}`, { status: 500 });
  }
}
