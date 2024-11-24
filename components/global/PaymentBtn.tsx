"use client";

import React, { useTransition } from "react";
import Loader from "./loader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSubscription } from "@/lib/actions/subscription";

const PaymentBtn = () => {
  const [isPending, startTransition] = useTransition();

  const onSubscribe = () => {
    startTransition(async () => {
      await createSubscription()
        .then((data) => {
          if (data.error || data.status !== 200) {
            toast.error(data.error);

            return;
          }

          window.location.href = `${data.session_url}`;
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <Button
      className="text-sm w-full bg-muted hover:bg-muted-foreground text-black font-bold disabled:bg-muted-foreground"
      onClick={onSubscribe}
      disabled={isPending}
    >
      <Loader color="#000" state={isPending}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentBtn;
