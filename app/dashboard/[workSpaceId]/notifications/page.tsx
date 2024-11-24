import { Suspense } from "react";
import { User } from "lucide-react";
import Wrapper from "../_components/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserNotifications } from "@/lib/data/notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function NotificationsPage({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  const notifications = await getUserNotifications();

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense
        fallback={
          <div className="flex flex-col p-5">
            <Skeleton className="h-8 w-1/2 mb-4" />

            <div className="flex flex-col gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="border-2 flex gap-x-3 items-center rounded-lg p-3"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />

                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center h-full w-full mt-4">
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        }
      >
        {notifications.length > 0 ? (
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-2 flex gap-x-3 items-center rounded-lg p-3"
              >
                <Avatar>
                  <AvatarFallback>
                    <User className="text-black" />
                  </AvatarFallback>
                </Avatar>

                <p>{notification.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <p>No new Notification!</p>
          </div>
        )}
      </Suspense>
    </Wrapper>
  );
}
