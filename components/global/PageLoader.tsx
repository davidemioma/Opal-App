import React from "react";
import { Spinner } from "./loader/Spinner";

const PageLoader = () => {
  return (
    <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default PageLoader;
