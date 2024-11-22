import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPreviewVideo } from "@/lib/data/videos";
import Preview, { PreviewSkeleton } from "@/components/global/videos/Preview";

export default async function PreviewPage({
  params: { videoId },
}: {
  params: { videoId: string };
}) {
  const video = await getPreviewVideo(videoId);

  if (!video) {
    return notFound();
  }

  return (
    <Suspense fallback={<PreviewSkeleton />}>
      <Preview video={video} showNav />
    </Suspense>
  );
}
