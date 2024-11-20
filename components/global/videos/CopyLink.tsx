import React from "react";
import { toast } from "sonner";
import { Links } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Props = {
  videoId: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
};

const CopyLink = ({ videoId, className, variant }: Props) => {
  const onCopyClipboard = () => {
    navigator.clipboard.writeText(``);

    toast("Copied", {
      description: "Link successfully copied",
    });
  };

  return (
    <Button variant={variant} onClick={onCopyClipboard} className={className}>
      <Links />
    </Button>
  );
};

export default CopyLink;
