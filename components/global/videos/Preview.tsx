"use client";

import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import AITools from "./AITools";
import CopyLink from "./CopyLink";
import RichLink from "./RichLink";
import Activitity from "./Activitity";
import { PreviewVideoType } from "@/types";
import { Button } from "@/components/ui/button";
import { cn, truncateString } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Download, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  video: PreviewVideoType;
  showNav?: boolean;
};

const Preview = ({ video, showNav }: Props) => {
  const { user } = useUser();

  const daysAgo = video.createdAt
    ? Math.floor(
        (new Date().getTime() - video.createdAt.getTime()) /
          (24 * 60 * 60 * 1000)
      )
    : 0;

  return (
    <>
      {showNav && (
        <div className="bg-[#111111] flex items-center justify-between px-5 lg:px-10 py-4">
          <Logo className="mb-0 p-0" />

          {user ? (
            <div className="flex items-center gap-3">
              <UserButton />

              <Link href="/dashboard">
                <Button
                  className="text-sm md:text-base flex gap-2"
                  variant="secondary"
                >
                  Dashboard
                  <ArrowRight fill="#000" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/auth/sign-in">
              <Button className="text-sm md:text-base flex gap-2">
                <User fill="#000" />
                Login
              </Button>
            </Link>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid lg:grid-cols-3 gap-5 overflow-y-auto",
          showNav ? "p-5 lg:p-10" : "px-5 lg:px-10 pb-5"
        )}
      >
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-5">
              <h2 className="text-white capitalize text-2xl md:text-4xl font-bold">
                {video.title}
              </h2>

              {video.author && <div>Edit Video</div>}
            </div>

            <span className="flex items-center gap-3 text-sm md:text-base">
              <p className="text-[#9D9D9D] capitalize">
                {video.user?.firstname} {video.user?.lastname}
              </p>

              <p className="text-[#707070]">
                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </p>
            </span>
          </div>

          <video
            preload="metadata"
            className="w-full aspect-video opacity-50 rounded-xl"
            controls
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
            />
          </video>

          <div className="flex flex-col gap-4 text-xl md:text-2xl">
            <div className="flex items-center justify-between gap-5">
              <p className="text-[#BDBDBD] text-semibold">Description</p>

              {video.author && <div>Edit Video</div>}
            </div>

            <p className="text-[#9D9D9D] text-lg text-medium">
              {video.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-16">
          <div className="flex items-center justify-end gap-3">
            <CopyLink
              variant="outline"
              className="bg-transparent px-10 rounded-full"
              videoId={video.id || ""}
            />

            <RichLink
              id={video.id as string}
              title={video.title as string}
              source={video.source as string}
              description={truncateString(video.description as string, 150)}
            />

            <Download className="text-[#4d4c4c]" />
          </div>

          <div className="w-full">
            <Tabs defaultValue="Ai tools" className="w-full lg:mt-3">
              <TabsList className="bg-transparent flex justify-start">
                <TabsTrigger value="Ai tools">Ai tools</TabsTrigger>

                <TabsTrigger value="Transcript">Transcript</TabsTrigger>

                <TabsTrigger value="Activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="Ai tools">
                <AITools
                  videoId={video.id as string}
                  trial={video.user?.trial!}
                  plan={video.user?.subscription?.plan!}
                />
              </TabsContent>

              <TabsContent value="Transcript">
                <p className="text-[#a7a7a7]">
                  {video.summery || "No summary available"}
                </p>
              </TabsContent>

              <TabsContent value="Activity">
                <Activitity
                  videoId={video.id!}
                  author={
                    `${video.user?.firstname} ${video.user?.lastname}` ||
                    "Unknown"
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export const PreviewSkeleton = () => {
  return (
    <div className="bg-[#111111] p-5 lg:p-10">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32" />

        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-5">
              <Skeleton className="h-6 w-3/4" />

              <Skeleton className="h-6 w-20" />
            </div>

            <span className="flex items-center gap-3 text-sm md:text-base">
              <Skeleton className="h-4 w-1/3" />

              <Skeleton className="h-4 w-1/4" />
            </span>
          </div>

          <Skeleton className="w-full aspect-video h-64" />

          <div className="flex flex-col gap-4 text-xl md:text-2xl">
            <div className="flex items-center justify-between gap-5">
              <Skeleton className="h-6 w-32" />

              <Skeleton className="h-6 w-20" />
            </div>

            <Skeleton className="text-[#9D9D9D] text-lg text-medium h-20" />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-16">
          <div className="flex items-center justify-end gap-3">
            <Skeleton className="h-10 w-32" />

            <Skeleton className="h-10 w-32" />

            <Skeleton className="h-10 w-10" />
          </div>

          <div className="w-full">
            <div className="flex justify-start">
              <Skeleton className="h-8 w-24" />

              <Skeleton className="h-8 w-24" />

              <Skeleton className="h-8 w-24" />
            </div>

            <div className="mt-2">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
