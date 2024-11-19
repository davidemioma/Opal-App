"use client";

import React, { useState, useRef, useTransition } from "react";
import Loader from "../loader";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateFolder } from "@/lib/actions/folder";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import FolderDuotone from "@/components/icons/folder-duotone";

type Props = {
  folder: {
    id: string;
    name: string;
    _count: {
      videos: number;
    };
  };
};

const Folder = ({ folder }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(folder.name || "Untitled");

  const onFolderClick = () => {
    if (isEditing) return;

    router.push(`${pathname}/folders/${folder.id}`);
  };

  const renameHandler = () => {
    startTransition(async () => {
      if (!inputRef.current) return;

      if (inputRef.current.value) {
        await updateFolder({
          folderId: folder.id,
          name: inputRef.current.value,
        })
          .then((data) => {
            if (data.error) {
              toast.error(data.error);

              return;
            }

            toast.success(data.message);

            data.name && setName(data.name);

            setIsEditing(false);
          })
          .catch((err) => {
            toast.error(
              err.message || "Something went wrong! internal server error."
            );
          });
      } else {
        setIsEditing(false);
      }
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);

      renameHandler();
    }
  };

  return (
    <div
      className="flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]"
      onClick={onFolderClick}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap-0.5">
          {isEditing ? (
            <Input
              className="border-none text-sm w-full outline-none text-neutral-300 bg-transparent p-2"
              ref={inputRef}
              autoFocus
              placeholder={folder.name}
              onKeyDown={onKeyDown}
              onBlur={renameHandler}
            />
          ) : (
            <p
              className="text-neutral-300"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={() => setIsEditing(true)}
            >
              {name}
            </p>
          )}

          <span className="text-sm text-neutral-500">
            {folder._count.videos || 0} videos
          </span>
        </div>
      </Loader>

      <FolderDuotone />
    </div>
  );
};

export const FolderSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-2 min-w-[250px] py-4 px-4 rounded-lg border-[1px]">
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-5 w-full" />

        <Skeleton className="h-4 w-1/2" />
      </div>

      <Skeleton className="h-6 w-6" />
    </div>
  );
};

export default Folder;
