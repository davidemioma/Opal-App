import React from "react";
import { verifyUser } from "@/lib/actions/workspace";
import { notFound, redirect } from "next/navigation";
import Sidebar from "./sidebar/Index";
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

  return (
    <main className="w-screen h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:inline-flex">
        <Sidebar currentWorkSpaceId={workSpaceId} workspaces={workspaces} />
      </div>

      {children}
    </main>
  );
};

export default Wrapper;
