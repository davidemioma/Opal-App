import React from "react";
import { PreviewVideoType } from "@/types";

type Props = {
  video: PreviewVideoType;
};

const Preview = ({ video }: Props) => {
  const daysAgo = video.createdAt
    ? Math.floor(
        (new Date().getTime() - video.createdAt.getTime()) /
          (24 * 60 * 60 * 1000)
      )
    : 0;

  return (
    <div className="grid xl:grid-cols-3 gap-5 p-5 lg:p-10 overflow-y-auto">
      Preview
    </div>
  );
};

export const PreviewSkeleton = () => {
  return (
    <div className="grid xl:grid-cols-3 gap-5 p-5 lg:p-10">PreviewSkeleton</div>
  );
};

export default Preview;
