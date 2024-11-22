import { Suspense } from "react";
import { notFound } from "next/navigation";
import Wrapper from "../_components/Wrapper";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { getPaymentInfo } from "@/lib/data/billing";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BillingPage({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  const paymentInfo = await getPaymentInfo();

  if (!paymentInfo) {
    return notFound();
  }

  return (
    <Wrapper workSpaceId={workSpaceId}>
      <Suspense
        fallback={
          <div className="bg-[#1D1D1D] flex flex-col gap-8 p-5 rounded-xl">
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />

              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-10 w-1/4 mb-2" />

              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        }
      >
        <div className="bg-[#1D1D1D] flex flex-col gap-8 p-5 rounded-xl">
          <div>
            <h2 className="text-2xl">Current Plan</h2>

            <p className="text-[#9D9D9D]">Your Payment Histroy</p>
          </div>

          <div>
            <h2 className="text-2xl">
              $
              {paymentInfo.subscription?.plan === SUBSCRIPTION_PLAN.PRO
                ? "99"
                : "0"}
              /Month
            </h2>

            <p className="text-[#9D9D9D]">{paymentInfo.subscription?.plan}</p>
          </div>
        </div>
      </Suspense>
    </Wrapper>
  );
}
