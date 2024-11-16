import React from "react";
import { Spinner } from "@/components/global/loader/Spinner";

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
};

export default loading;
