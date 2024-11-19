import { notFound } from "next/navigation";
import Wrapper from "../../_components/Wrapper";
import { getFolderInfo } from "@/lib/data/folders";
import { getFolderVideos } from "@/lib/data/videos";

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

  return <Wrapper workSpaceId={workSpaceId}>FolderPage {folderId}</Wrapper>;
}
