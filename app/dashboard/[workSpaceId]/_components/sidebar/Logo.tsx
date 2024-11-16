import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="bg-[#111111] flex items-center justify-center gap-2 p-4 mb-4">
      <Image src="/opal-logo.svg" width={40} height={40} alt="Logo" />

      <p className="text-2xl">Opal</p>
    </div>
  );
};

export default Logo;
