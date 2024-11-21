import { Suspense } from "react";
import { notFound } from "next/navigation";
import Wrapper from "./_components/Wrapper";
import Videos from "@/components/global/videos";
import Folders from "@/components/global/folders";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import PageLoader from "@/components/global/PageLoader";
import CreateWorkspace from "@/components/global/CreateWorkspace";
import CreateFolder from "@/components/global/folders/CreateFolder";
import { getWorkspaceById, getWorkspaceVideos } from "@/lib/data/workspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Workspace({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  const workspace = await getWorkspaceById(workSpaceId);

  if (!workspace) {
    return notFound();
  }

  const videos = await getWorkspaceVideos(workSpaceId);

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense fallback={<PageLoader />}>
        <Tabs defaultValue="videos" className="mt-6">
          <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
            <TabsList className="bg-transparent gap-2 pl-0">
              <TabsTrigger
                className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] data-[state=active]:text-white"
                value="videos"
              >
                Videos
              </TabsTrigger>

              <TabsTrigger
                className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] data-[state=active]:text-white"
                value="archive"
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-3">
              {workspace.user.subscription?.plan === SUBSCRIPTION_PLAN.PRO && (
                <CreateWorkspace />
              )}

              <CreateFolder workspaceId={workSpaceId} />
            </div>
          </div>

          <TabsContent value="videos" className="mt-9 flex flex-col gap-10">
            <Folders workspaceId={workSpaceId} />

            <Videos videos={videos} workspaceId={workSpaceId} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </Wrapper>
  );
}
