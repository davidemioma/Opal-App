import React from "react";
import CommentForm from "../comments/CommentForm";

type Props = {
  videoId: string;
  author: string;
};

const Activitity = ({ videoId, author }: Props) => {
  return (
    <div className="flex flex-col gap-5 rounded-xl">
      <CommentForm videoId={videoId} author={author} />

      <div>Comments</div>
    </div>
  );
};

export default Activitity;
