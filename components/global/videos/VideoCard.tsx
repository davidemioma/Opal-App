import React from "react";
import Link from "next/link";
import Loader from "../loader";
import { cn } from "@/lib/utils";
import CopyLink from "./CopyLink";
import CardMenu from "./CardMenu";
import { VideoType } from "@/types";
import { Dot, Share2, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  workspaceId: string;
  video: VideoType;
};

const VideoCard = ({ workspaceId, video }: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return (
    <Loader
      state={video.processing}
      className={cn(
        "bg-[#171717] flex items-center justify-center border border-[rgb(37,37,37)] rounded-xl",
        video.processing && "p-3"
      )}
    >
      <div className="group bg-[#171717] relative flex flex-col border border-[rgb(37,37,37)] rounded-xl overflow-hidden cursor-pointer">
        <div className="hidden absolute top-3 right-3 z-50 group-hover:inline-flex gap-3">
          <CardMenu
            videoId={video.id}
            currentWorkspaceId={workspaceId}
            currentFolderId={video.folder.id}
            currentFolderName={video.folder.name}
            currentWorkspaceName={video.workspace.name}
          />

          <CopyLink
            className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]"
            videoId={video.id}
          />
        </div>

        <Link
          href={`/dashboard/${workspaceId}/videos/${video.id}`}
          className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
        >
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#t=1`}
            />
          </video>

          <div className="flex flex-col gap-2 px-5 py-3 z-20">
            <h2 className="text-sm font-semibold text-[#BDBDBD]">
              {video.title}
            </h2>

            <div className="flex items-center gap-2 mt-4">
              <Avatar className=" w-8 h-8">
                <AvatarImage src={video.user.image as string} />

                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="capitalize text-xs text-[#BDBDBD]">
                  {video.user.firstname} {video.user.lastname}
                </p>

                <p className="text-[#6d6b6b]  text-xs flex items-center ">
                  <Dot /> {daysAgo < 1 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <span className="flex items-center gap-1">
                <Share2 fill="#9D9D9D" className="text-[#9D9D9D]" size={12} />

                <p className="text-xs text-[#9D9D9D] capitalize">
                  {video.user.firstname}'s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export const VideoCardSkeleton = () => {
  return (
    <div className="group bg-[#171717] relative flex flex-col border border-[rgb(37,37,37)] rounded-xl overflow-hidden cursor-pointer">
      <Skeleton className="w-full aspect-video" />

      <div className="flex flex-col gap-2 px-5 py-3">
        <Skeleton className="h-4 w-3/4" />

        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-8 w-8 rounded-full" />

          <div className="flex flex-col">
            <Skeleton className="h-4 w-1/2" />

            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
