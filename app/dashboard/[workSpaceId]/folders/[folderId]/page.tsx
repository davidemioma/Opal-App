import { Suspense } from "react";
import { notFound } from "next/navigation";
import Wrapper from "../../_components/Wrapper";
import { getFolderInfo } from "@/lib/data/folders";
import { Skeleton } from "@/components/ui/skeleton";
import { getFolderVideos } from "@/lib/data/videos";
import Videos, { VideosSkeleton } from "@/components/global/videos";

export default async function FolderPage({
  params: { workSpaceId, folderId },
}: {
  params: { workSpaceId: string; folderId: string };
}) {
  const folder = await getFolderInfo({ workSpaceId, folderId });

  if (!folder) {
    return notFound();
  }

  const videos = await getFolderVideos({ workspaceId: workSpaceId, folderId });

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense fallback={<FolderPageSkeleton />}>
        <h2 className="text[#BdBdBd] text-2xl mb-6">{folder.name}</h2>

        <Videos videos={videos} workspaceId={workSpaceId} />
      </Suspense>
    </Wrapper>
  );
}

const FolderPageSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-1/2 mb-6" />

      <VideosSkeleton />
    </div>
  );
};
