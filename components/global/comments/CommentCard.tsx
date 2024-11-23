"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CommentType } from "@/types";
import CommentForm from "./CommentForm";
import { DotIcon, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReplies } from "@/lib/data/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  comment: CommentType;
};

const CommentCard = ({ comment }: Props) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const daysAgo = Math.floor(
    (new Date().getTime() - comment.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  const { data: replies } = useQuery({
    queryKey: ["get-replies", comment.videoId, comment.id],
    queryFn: async () => {
      const data = await getReplies({
        videoId: comment.videoId,
        commentId: comment.id,
      });

      return data as CommentType[];
    },
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5",
        comment.commentId && "ml-5 pl-2 border-l border-muted-foreground"
      )}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={comment.user.image || ""} />

            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>

          <div className="">
            <p className="capitalize text-xs text-[#BDBDBD] flex items-center">
              {comment.user.firstname} {comment.user.lastname}{" "}
              <div className="flex items-center gap-[0]">
                <DotIcon className="text-[#707070]" />

                <span className="text-[#707070] text-xs ml-[-6px]">
                  {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </span>
              </div>
            </p>

            <p className="text-[#BDBDBD] text-sm">{comment.text}</p>
          </div>
        </div>

        {!showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            className="text-xs text-white"
          >
            Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <CommentForm
          videoId={comment.videoId}
          commentId={comment.id}
          author={
            `${comment.user?.firstname} ${comment.user?.lastname}` || "Unknown"
          }
          queryKey={["get-replies", comment.videoId, comment.id]}
          onClose={() => setShowReplyForm(false)}
        />
      )}

      {replies && (
        <div className="space-y-2">
          {replies.map((reply) => (
            <CommentCard comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
