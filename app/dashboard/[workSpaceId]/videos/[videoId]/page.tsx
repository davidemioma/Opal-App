import { Suspense } from "react";
import { notFound } from "next/navigation";
import Wrapper from "../../_components/Wrapper";
import { getPreviewVideo } from "@/lib/data/videos";
import Preview, { PreviewSkeleton } from "@/components/global/videos/Preview";

export default async function VideoPage({
  params: { workSpaceId, videoId },
}: {
  params: { workSpaceId: string; videoId: string };
}) {
  const video = await getPreviewVideo(videoId);

  if (!video) {
    return notFound();
  }

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense fallback={<PreviewSkeleton />}>
        <Preview video={video} />
      </Suspense>
    </Wrapper>
  );
}
