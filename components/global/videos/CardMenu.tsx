"use client";

import React, { useState } from "react";
import { Move } from "lucide-react";
import ChangeVidLocation from "./ChangeVidLocation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  videoId: string;
  currentWorkspaceId: string;
  currentWorkspaceName: string;
  currentFolderId: string;
  currentFolderName: string;
};

const CardMenu = ({
  videoId,
  currentWorkspaceId,
  currentWorkspaceName,
  currentFolderId,
  currentFolderName,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Move size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to new Workspace/Folder</DialogTitle>

          <DialogDescription>
            This action cannot be undone. This will permanently move your video
            to a new Workspace/Folder.
          </DialogDescription>
        </DialogHeader>

        <ChangeVidLocation
          videoId={videoId}
          currentWorkSpaceId={currentWorkspaceId}
          currentWorksapceName={currentWorkspaceName}
          currentFolderId={currentFolderId}
          currentFolderName={currentFolderName}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CardMenu;
