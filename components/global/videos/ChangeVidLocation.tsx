"use client";

import React, { useState, useTransition } from "react";
import Loader from "../loader";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import useMoveVideo from "@/hooks/use-move-video";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { MoveVideoValidator, MoveVideoSchema } from "@/lib/validators/video";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  videoId: string;
  currentWorkSpaceId: string;
  currentWorksapceName: string;
  currentFolderId: string;
  currentFolderName: string;
  onClose?: () => void;
};

const ChangeVidLocation = ({
  videoId,
  currentWorkSpaceId,
  currentWorksapceName,
  currentFolderId,
  currentFolderName,
  onClose,
}: Props) => {
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [selectedWorkspaceId, setSelectedWorkspaceId] =
    useState(currentWorkSpaceId);

  const {
    workspaces,
    fetchingWorkspaces,
    folders,
    fetchingFolders,
    moveVideoHandler,
  } = useMoveVideo({ videoId, selectedWorkspaceId, pathname });

  const form = useForm<MoveVideoValidator>({
    resolver: zodResolver(MoveVideoSchema),
    defaultValues: {
      workspaceId: currentWorkSpaceId,
      folderId: currentFolderId,
    },
  });

  const onSubmit = (values: MoveVideoValidator) => {
    startTransition(async () => {
      await moveVideoHandler(values).then(() => {
        if (onClose) onClose();
      });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="boder rounded-xl p-5">
            <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
            {currentWorksapceName && <p>{currentWorksapceName}</p>}

            <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
            {currentFolderName ? (
              <p>{currentFolderName}</p>
            ) : (
              "This video has no folder"
            )}
          </div>

          <Separator orientation="horizontal" />

          <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
            <h2 className="text-xs text-[#a4a4a4]">To</h2>

            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);

                      setSelectedWorkspaceId(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your workspace" />
                      </SelectTrigger>
                    </FormControl>

                    {workspaces && workspaces?.length > 0 ? (
                      <SelectContent>
                        {workspaces?.map((workspace) => (
                          <SelectItem value={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : fetchingWorkspaces ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-[30%] h-4 rounded-xl" />

                        <Skeleton className="w-full h-8 rounded-xl" />
                      </div>
                    ) : (
                      <p className="text-[#a4a4a4] text-sm">
                        No workspaces available
                      </p>
                    )}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {workspaces && (
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folders in this workspace</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a folder in the workspace" />
                        </SelectTrigger>
                      </FormControl>

                      {folders && folders?.length > 0 ? (
                        <SelectContent>
                          {folders?.map((folder) => (
                            <SelectItem value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : fetchingFolders ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-[30%] h-4 rounded-xl" />

                          <Skeleton className="w-full h-8 rounded-xl" />
                        </div>
                      ) : (
                        <p className="text-[#a4a4a4] text-sm">
                          This workspace has no folders
                        </p>
                      )}
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button
            type="submit"
            className="bg-muted w-full text-black hover:bg-muted-foreground font-semibold"
            disabled={isPending || fetchingFolders || fetchingWorkspaces}
          >
            <Loader state={isPending} color="#000">
              Transfer
            </Loader>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangeVidLocation;
