import React from "react";
import Sidebar from "./sidebar/Index";
import Heading from "@/components/global/Heading";
import InfoBar from "@/components/global/InfoBar";
import MobileSidebar from "./sidebar/MobileSidebar";
import { verifyUser } from "@/lib/actions/workspace";
import { notFound, redirect } from "next/navigation";
import { getWorkspaces } from "@/lib/data/workspace";

type Props = {
  children: React.ReactNode;
  workSpaceId: string;
};

const Wrapper = async ({ children, workSpaceId }: Props) => {
  const access = await verifyUser(workSpaceId);

  if (access.status === 401) {
    return redirect("/auth/sign-in");
  }

  if (access.status === 404 || access.status === 500) {
    return notFound();
  }

  const workspaces = await getWorkspaces();

  const currentWorkspace = workspaces.find(
    (workspace) => workspace.id === workSpaceId
  );

  return (
    <main className="w-screen h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:inline-flex">
        <Sidebar currentWorkSpaceId={workSpaceId} workspaces={workspaces} />
      </div>

      <div className="flex-1 p-4 h-full overflow-y-scroll overflow-x-hidden">
        <header className="flex items-center justify-between gap-1">
          <div className="lg:hidden">
            <MobileSidebar
              currentWorkSpaceId={workSpaceId}
              workspaces={workspaces}
            />
          </div>

          <InfoBar />
        </header>

        <main className="w-full mt-10">
          <Heading workspace={currentWorkspace} />

          <div className="mt-4">{children}</div>
        </main>
      </div>
    </main>
  );
};

export default Wrapper;
