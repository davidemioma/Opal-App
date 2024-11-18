"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { createFolder } from "@/lib/actions/folder";
import FolderPlusDuotine from "../../icons/folder-plus-duotone";

type Props = {
  workspaceId: string;
};

const CreateFolder = ({ workspaceId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      await createFolder(workspaceId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);

            return;
          }

          toast.success(data.message);
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <Button
      onClick={onClick}
      className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl disabled:opacity-75 disabled:cursor-not-allowed"
      disabled={isPending}
    >
      <FolderPlusDuotine />
      Create A folder
    </Button>
  );
};

export default CreateFolder;
