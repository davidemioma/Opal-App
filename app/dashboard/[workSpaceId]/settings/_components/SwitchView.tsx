"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { updateUserFirstView } from "@/lib/actions/user";

type Props = {
  checked: boolean;
};

const SwitchView = ({ checked }: Props) => {
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const changeViewState = () => {
    startTransition(async () => {
      await updateUserFirstView({ firstView: checked, pathname })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);

            return;
          }

          toast.success(data.message);
        })
        .catch((err) => {
          toast.error(
            err.message || "Something went wrong! internal server error."
          );
        });
    });
  };

  return (
    <div className="flex items-center gap-x-3 mt-4 text-md">
      Enable First View
      <Switch
        checked={checked}
        onCheckedChange={changeViewState}
        disabled={isPending}
      />
    </div>
  );
};

export default SwitchView;
