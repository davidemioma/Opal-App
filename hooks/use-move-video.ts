"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { changeVideoLocation } from "@/lib/actions/video";
import { MoveVideoValidator } from "@/lib/validators/video";
import {
  getFoldersByWorkspaceId,
  getWorkspacesOptions,
} from "@/lib/data/videos";

const useMoveVideo = ({
  videoId,
  selectedWorkspaceId,
  pathname,
}: {
  videoId: string;
  selectedWorkspaceId: string;
  pathname?: string;
}) => {
  const { data: workspaces, isFetching: fetchingWorkspaces } = useQuery({
    queryKey: ["get-workspaces"],
    queryFn: async () => {
      const data = await getWorkspacesOptions();

      return data;
    },
  });

  const {
    data: folders,
    isFetching: fetchingFolders,
    refetch,
  } = useQuery({
    queryKey: ["get-folders", selectedWorkspaceId],
    queryFn: async () => {
      const data = await getFoldersByWorkspaceId(selectedWorkspaceId);

      return data;
    },
  });

  useEffect(() => {
    if (!selectedWorkspaceId) return;

    refetch();
  }, [selectedWorkspaceId]);

  const moveVideoHandler = async (values: MoveVideoValidator) => {
    await changeVideoLocation({ pathname, videoId, ...values })
      .then((data) => {
        if (data.error) {
          toast.error(data.error);

          return;
        }

        if (data.status === 200) {
          toast.success(data.message);
        }
      })
      .catch((err) => {
        toast.error(
          err.message || "Something went wrong! internal server error."
        );
      });
  };

  return {
    workspaces,
    fetchingWorkspaces,
    folders,
    fetchingFolders,
    moveVideoHandler,
  };
};

export default useMoveVideo;
