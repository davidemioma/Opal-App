"use client";

import React, { useState } from "react";
import InviteForm from "./InviteForm";
import { PlusCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  workspaceId: string;
};

const Invite = ({ workspaceId }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="w-full bg-neutral-800/90 flex items-center justify-center gap-2 p-1.5 hover:bg-neutral-800/60 rounded-sm">
          <PlusCircleIcon
            className="text-neutral-800/90 fill-neutral-500"
            size={15}
          />

          <span className="text-neutral-400 font-semibold text-xs">
            Invite To Workspace
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-[#111111] text-white">
        <DialogHeader>
          <DialogTitle>Invite To Workspace</DialogTitle>

          <DialogDescription>
            Invite other users to your workspace
          </DialogDescription>
        </DialogHeader>

        <InviteForm workspaceId={workspaceId} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default Invite;
