import { Suspense } from "react";
import Wrapper from "../_components/Wrapper";
import { getWixContent } from "@/lib/data/home";
import VideoCard, {
  VideoCardSkeleton,
} from "@/components/global/videos/VideoCard";

export default async function HomePage({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  const videos = await getWixContent();

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense
        fallback={
          <div className="grid lg:grid-cols-2 gap-5">
            {new Array(8).fill("").map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        {videos.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-5">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                workspaceId={workSpaceId}
                video={video}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center py-6">
            <p className="text-[#a4a4a4] text-sm">No videos available!</p>
          </div>
        )}
      </Suspense>
    </Wrapper>
  );
}
