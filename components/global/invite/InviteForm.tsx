"use client";

import React, { useTransition } from "react";
import Loader from "../loader";
import { toast } from "sonner";
import { User } from "lucide-react";
import useSearch from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  workspaceId: string;
  onClose?: () => void;
};

const InviteForm = ({ workspaceId, onClose }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { query, onQueryChange, users, isFetching, isLoading } = useSearch();

  const loadingUsers = isFetching || isLoading;

  const handleInvite = ({
    recieverId,
    email,
  }: {
    recieverId: string;
    email: string;
  }) => {
    startTransition(async () => {
      await inviteUser({
        workspaceId,
        recieverId,
        email,
      })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);

            return;
          }

          toast.success(data.message);

          if (onClose) onClose();
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Input
        type="text"
        placeholder="Search Users..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      {loadingUsers ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found!</p>
      ) : (
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-3 items-center border-2 w-full p-3 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />

                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize">
                  {user.firstname} {user.lastname}
                </h3>

                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  className="w-5/12 font-bold"
                  onClick={() =>
                    handleInvite({ recieverId: user.id, email: user.email })
                  }
                >
                  <Loader state={isPending} color="#000">
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InviteForm;
