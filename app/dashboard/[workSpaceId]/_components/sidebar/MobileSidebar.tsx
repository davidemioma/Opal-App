"use client";

import React, { useState } from "react";
import Sidebar from "./Index";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  currentWorkSpaceId: string;
  workspaces: {
    id: string;
    name: string;
    type: string;
    user: {
      subscription: {
        plan: SUBSCRIPTION_PLAN;
      } | null;
    };
  }[];
};

const MobileSidebar = ({ currentWorkSpaceId, workspaces }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost" className="mt-[2px]">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="bg-[#111111] w-fit text-white border-none p-0"
        side="left"
      >
        <Sidebar
          currentWorkSpaceId={currentWorkSpaceId}
          workspaces={workspaces}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
