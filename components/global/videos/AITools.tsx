"use client";

import React from "react";
import Loader from "../loader";
import { Button } from "../../ui/button";
import { SUBSCRIPTION_PLAN } from "@prisma/client";
import { Bot, FileTextIcon, Pencil, StarsIcon } from "lucide-react";

type Props = {
  videoId: string;
  plan: SUBSCRIPTION_PLAN | null;
  trial: boolean;
};

const AITools = ({ plan, trial }: Props) => {
  return (
    <div className="bg-[#1D1D1D] flex flex-col gap-6 p-5 rounded-xl">
      <div className="flex lg:flex-col gap-4">
        <div className="w-full space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold"> Ai Tools</h2>

          <p className="text-[#BDBDBD] text-sm">
            Taking your video to the next step with the power of AI!
          </p>
        </div>

        <div className="w-full flex items-center gap-4 justify-end lg:justify-start">
          {plan === SUBSCRIPTION_PLAN.FREE ? (
            trial ? (
              <Button className="bg-muted text-black hover:bg-muted-foreground mt-2 text-sm">
                <Loader state={false} color="#000">
                  Try now
                </Loader>
              </Button>
            ) : (
              <Button
                className="bg-muted text-black hover:bg-muted-foreground mt-2 ext-sm"
                variant={"secondary"}
              >
                <Loader state={false} color="#000">
                  Pay Now
                </Loader>
              </Button>
            )
          ) : (
            <Button className="bg-muted text-black hover:bg-muted-foreground mt-2 text-sm">
              <Loader state={false} color="#000">
                Generate Now
              </Loader>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-[#1b0f1b7f] flex flex-col p-4 gap-4 border-[1px] rounded-xl">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-[#a22fe0]"> Opal Ai</h2>

          <StarsIcon color="#a22fe0" fill="#a22fe0" />
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
            <Pencil color="#a22fe0" />
          </div>

          <div className="flex flex-col">
            <h3 className="textmdg">Summary</h3>

            <p className="text-muted-foreground text-sm">
              Generate a description for your video using AI.
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
            <FileTextIcon color="#a22fe0" />
          </div>

          <div className="flex flex-col">
            <h3 className="textmdg">Summary</h3>

            <p className="text-muted-foreground text-sm">
              Generate a description for your video using AI.
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b] ">
            <Bot color="#a22fe0" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-md">AI Agent</h3>

            <p className="text-muted-foreground text-sm">
              Viewers can ask questions on your video and our ai agent will
              respond.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
