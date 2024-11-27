import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const body = await request.json();

  if (!body || typeof body !== "object") {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  const { screen, audio, preset } = body;

  try {
    const studio = await prismadb.user.update({
      where: {
        id,
      },
      data: {
        studio: {
          update: {
            screen,
            preset,
            mic: audio,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!studio) {
      return new NextResponse("Studio not found", {
        status: 404,
      });
    }

    return NextResponse.json({ status: 200, message: "Studio Updated!" });
  } catch (err) {
    console.error("UPDATE_STUDIO_SETTINGS", err);

    return new NextResponse(`Internal Error! ${err}`, { status: 500 });
  }
}
