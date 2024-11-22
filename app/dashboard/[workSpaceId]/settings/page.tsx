import { Suspense } from "react";
import { notFound } from "next/navigation";
import Wrapper from "../_components/Wrapper";
import SwitchView from "./_components/SwitchView";
import { getUserSettings } from "@/lib/data/users";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SettingsPage({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  const userSettings = await getUserSettings();

  if (!userSettings) {
    return notFound();
  }

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense
        fallback={
          <div className="flex flex-col">
            <Skeleton className="h-8 w-1/2 mb-5" />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />

                <Skeleton className="h-4 w-1/2" />

                <Skeleton className="mt-5 h-7 w-[20%]" />
              </div>
            </div>
          </div>
        }
      >
        <h2 className="text-2xl font-bold mt-4">Video Sharing Settings</h2>

        <p className="text-muted-foreground w-8/12 mt-1.5 mb-3">
          Enabling this feature will send you notifications when someone watched
          your video for the first time. This feature can help during client
          outreach.
        </p>

        <SwitchView checked={userSettings.firstView} />
      </Suspense>
    </Wrapper>
  );
}
