import { Loader } from "lucide-react";
import { acceptInvitation } from "@/lib/actions/user";
import { notFound, redirect } from "next/navigation";

export default async function InvitePage({
  params: { inviteId },
}: {
  params: { inviteId: string };
}) {
  const invite = await acceptInvitation(inviteId);

  if (invite.status === 401) {
    return redirect("/auth/sign-in");
  }

  if (invite.status === 404 || invite.status === 500) {
    return notFound();
  }

  if (invite.status === 200) {
    return redirect(`/dashboard/${invite.workspaceId}`);
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader className="w-20 h-20 animate-spin" />
    </div>
  );
}
