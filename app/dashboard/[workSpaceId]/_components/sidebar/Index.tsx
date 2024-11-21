"use client";

import React from "react";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { MENU_ITEMS } from "@/lib/constants";
import Invite from "@/components/global/invite";
import { Separator } from "@/components/ui/separator";
import PaymentBtn from "@/components/global/PaymentBtn";
import GlobalCard from "@/components/global/GlobalCard";
import { usePathname, useRouter } from "next/navigation";
import WorkspacePlaceholder from "./WorkspacePlaceholder";
import { SUBSCRIPTION_PLAN, WorkspaceType } from "@prisma/client";
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
    type: string;
    user: {
      subscription: {
        plan: SUBSCRIPTION_PLAN;
      } | null;
    };
  }[];
  onClose?: () => void;
};

const Sidebar = ({ currentWorkSpaceId, workspaces, onClose }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const currentWorkspace = workspaces.find(
    (workspace) => workspace.id === currentWorkSpaceId
  );

  const menuItems = MENU_ITEMS(currentWorkSpaceId);

  return (
    <div className="h-full w-[250px] bg-[#111111] text-white p-4 overflow-y-auto">
      <Logo />

      <Select
        defaultValue={currentWorkSpaceId}
        onValueChange={(value) => {
          router.push(`/dashboard/${value}`);

          if (onClose) onClose();
        }}
      >
        <SelectTrigger className="w-full mb-4">
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

      {currentWorkspace?.type === WorkspaceType.PUBLIC &&
        currentWorkspace.user.subscription?.plan === SUBSCRIPTION_PLAN.PRO && (
          <Invite workspaceId={currentWorkSpaceId} />
        )}

      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>

      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              href={item.href}
              icon={<item.icon />}
              selected={pathname === item.href}
              onClose={onClose}
            />
          ))}
        </ul>
      </nav>

      <Separator className="w-full mt-4 bg-muted-foreground opacity-35" />

      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspaces</p>

      {workspaces.length > 0 ? (
        <nav className="w-full">
          <ul className="h-[250px] overflow-auto overflow-x-hidden fade-layer">
            {workspaces.map((workspace) => (
              <SidebarItem
                key={workspace.id}
                title={workspace.name}
                href={`/dashboard/${workspace.id}`}
                icon={
                  <WorkspacePlaceholder>
                    {workspace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
                selected={pathname === `/dashboard/${workspace.id}`}
                onClose={onClose}
              />
            ))}
          </ul>
        </nav>
      ) : (
        <p className="w-full text-[#9D9D9D] text-center font-bold mt-4">
          No workspace
        </p>
      )}

      {currentWorkspace?.user.subscription?.plan === SUBSCRIPTION_PLAN.FREE && (
        <>
          <Separator className="w-full mt-4 bg-muted-foreground opacity-35" />

          <GlobalCard
            title="Upgrade to Pro"
            description=" Unlock AI features like transcription, AI summary, and more."
            footer={<PaymentBtn />}
          />
        </>
      )}
    </div>
  );
};

export default Sidebar;
