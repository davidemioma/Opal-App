"use client";

import React from "react";
import Loader from "./loader";
import { Button } from "@/components/ui/button";

const PaymentBtn = () => {
  return (
    <Button
      className="text-sm w-full bg-muted hover:bg-muted-foreground text-black font-bold disabled:bg-muted-foreground"
      onClick={() => {}}
      disabled={false}
    >
      <Loader color="#000" state={false}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentBtn;
