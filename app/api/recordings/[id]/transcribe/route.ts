import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { fileName, transcript, content } = body;

    if (!fileName) {
      return new NextResponse("File name not found", {
        status: 404,
      });
    }

    const jsonContent = JSON.parse(content);

    const video = await prismadb.video.update({
      where: {
        userId: id,
        source: fileName,
      },
      data: {
        title: jsonContent.title || "Unknown",
        description: jsonContent.summary,
        summery: transcript,
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

    // TODO: Wire Up AI agents

    return NextResponse.json({
      status: 200,
    });
  } catch (err) {
    console.error("TRANSCRIBE_SOCKET_ENDPOINT", err);

    return new NextResponse(`Internal Error! ${err}`, { status: 500 });
  }
}
