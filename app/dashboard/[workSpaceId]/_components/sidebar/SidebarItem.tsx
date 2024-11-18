"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  onClose?: () => void;
};

const SidebarItem = ({ href, icon, selected, title, onClose }: Props) => {
  return (
    <li
      className="cursor-pointer my-[5px]"
      onClick={() => {
        if (onClose) onClose();
      }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]",
          selected ? "bg-[#1D1D1D]" : ""
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
          {icon}

          <span
            className={cn(
              "font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32",
              selected ? "text-[#9D9D9D]" : "text-[#545454]"
            )}
          >
            {title}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
