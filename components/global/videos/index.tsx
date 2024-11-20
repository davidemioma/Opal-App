import React from "react";
import { VideoType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";

type Props = {
  workspaceId: string;
  videos: VideoType[];
};

const Videos = ({ workspaceId, videos }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <VideoRecorderDuotone />

        <h2 className="text-[#BdBdBd] text-xl">Videos</h2>
      </div>

      {videos.length > 0 ? (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
          {videos.map((video) => (
            <VideoCard key={video.id} workspaceId={workspaceId} video={video} />
          ))}
        </section>
      ) : (
        <div className="p-5">
          <p className="text-[#BDBDBD] text-center"> No videos in workspace</p>
        </div>
      )}
    </div>
  );
};

export const VideosSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />

        <Skeleton className="h-6 w-1/2" />
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </section>
    </div>
  );
};

export default Videos;
