"use client";

import React from "react";
import { CommentType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import CommentForm from "../comments/CommentForm";
import { getComments } from "@/lib/data/comments";
import CommentCard from "../comments/CommentCard";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  videoId: string;
  author: string;
};

const Activitity = ({ videoId, author }: Props) => {
  const { data: comments, isFetching } = useQuery({
    queryKey: ["get-comments", videoId],
    queryFn: async () => {
      const data = await getComments(videoId);

      return data as CommentType[];
    },
  });

  return (
    <div className="flex flex-col gap-5 rounded-xl">
      <CommentForm
        videoId={videoId}
        author={author}
        queryKey={["get-comments", videoId]}
      />

      {isFetching ? (
        <CommentsSkeleton />
      ) : comments && comments.length > 0 ? (
        <div className="space-y-2 h-[350px] overflow-y-auto">
          {comments.map((comment) => (
            <CommentCard comment={comment} />
          ))}
        </div>
      ) : (
        <div className="w-full p-5 text-center">
          <p className="text-[#a4a4a4] text-sm">No comments available</p>
        </div>
      )}
    </div>
  );
};

export const CommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 pb-2">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-1 flex-col">
            <Skeleton className="h-4 w-1/2" />

            <Skeleton className="h-4 w-3/4 mt-1" />

            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Activitity;
