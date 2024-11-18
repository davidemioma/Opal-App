import React from "react";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/nextjs";
import { Search, UploadIcon } from "lucide-react";
import VideoRecorderIcon from "../icons/video-recorder";

const InfoBar = () => {
  return (
    <div className="flex-1 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 border-2 rounded-full pl-4 py-2 w-full max-w-lg">
        <Search size={25} className="text-[#707070]" />

        <input
          className="flex-1 bg-transparent rounded-none text-sm border-none outline-none placeholder-neutral-500"
          placeholder="Search for people, projects & folders"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:inline-flex items-center gap-4">
          <Button className="bg-[#9D9D9D] hover:bg-[#9D9D9D]/75 text-black flex items-center gap-2">
            <UploadIcon size={20} />{" "}
            <span className="flex items-center gap-2">Upload</span>
          </Button>

          <Button className="bg-[#9D9D9D] hover:bg-[#9D9D9D]/75 text-black flex items-center gap-2">
            <VideoRecorderIcon />
            <span className="flex items-center gap-2">Record</span>
          </Button>
        </div>

        <UserButton signInUrl="/auth/sign-in" />
      </div>
    </div>
  );
};

export default InfoBar;
