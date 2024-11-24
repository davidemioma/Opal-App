import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { completeSubscription } from "@/lib/actions/subscription";

export default async function PaymentsPage({
  searchParams: { session_id, cancel },
}: {
  searchParams: { session_id?: string; cancel?: boolean };
}) {
  if (session_id) {
    const subscription = await completeSubscription(session_id);

    if (subscription.status !== 200) {
      return notFound();
    }

    return redirect("/dashboard");
  }

  if (cancel) {
    return redirect("/dashboard");
  }

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      }
    />
  );
}
