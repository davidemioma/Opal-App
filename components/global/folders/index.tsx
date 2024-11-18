import React from "react";
import { ArrowRight } from "lucide-react";
import FolderDuotone from "@/components/icons/folder-duotone";

type Props = {
  workspaceId: string;
};

const Folders = ({ workspaceId }: Props) => {
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
    </div>
  );
};

export default Folders;
