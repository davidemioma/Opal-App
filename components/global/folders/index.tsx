import React, { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getFolders } from "@/lib/data/folders";
import Folder, { FolderSkeleton } from "./Folder";
import FolderDuotone from "@/components/icons/folder-duotone";

type Props = {
  workspaceId: string;
};

const Folders = async ({ workspaceId }: Props) => {
  const folders = await getFolders(workspaceId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />

          <h2 className="text-[#BDBDBD] text-xl"> Folders</h2>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD] text-sm">See all</p>

          <ArrowRight className="w-4 h-4" color="#707070" />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="w-full flex items-center gap-4 overflow-x-auto">
            {new Array(10).fill("").map((_, i) => (
              <FolderSkeleton key={i} />
            ))}
          </div>
        }
      >
        {folders.length > 0 ? (
          <div className="w-full flex items-center gap-4 overflow-x-auto">
            {folders.map((folder) => (
              <Folder key={folder.id} folder={folder} />
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-4">
            <p className="text-neutral-300">No folders in workspace</p>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default Folders;
