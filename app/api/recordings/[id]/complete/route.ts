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

    const video = await prismadb.video.update({
      where: {
        userId: id,
        source: fileName,
      },
      data: {
        processing: false,
      },
      select: {
        id: true,
      },
    });

    if (!video) {
      return new NextResponse("Video not found", {
        status: 404,
      });
    }

    return NextResponse.json({
      status: 200,
    });
  } catch (err) {
    console.error("COMPLETE_SOCKET_ENDPOINT", err);

    return new NextResponse(`Internal Error! ${err}`, { status: 500 });
  }
}
