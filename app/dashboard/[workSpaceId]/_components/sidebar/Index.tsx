"use client";

import React from "react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentWorkSpaceId: string;
  workspaces: {
    id: string;
    name: string;
  }[];
};

const Sidebar = ({ currentWorkSpaceId, workspaces }: Props) => {
  const router = useRouter();

  return (
    <div className="h-full w-[250px] bg-[#111111] text-white p-4">
      <Logo />

      <Select
        defaultValue={currentWorkSpaceId}
        onValueChange={(value) => router.push(`/dashboard/${value}`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            className="text-white"
            placeholder="Select a Workspace..."
          />
        </SelectTrigger>

        <SelectContent className="bg-[#111111] text-white backdrop-blur-xl">
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sidebar;
